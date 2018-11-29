import Vue from 'vue';
import store from '@/store';
import md5 from 'crypto-js/md5';
import typedArraysLib from 'crypto-js/lib-typedarrays';

const contentLib = {
  _urltoFile(url, filename, type) {
    type = type || (url.match(/^data:([^;]+);/) || '')[1];
    return (fetch(url)
      .then(res => res.arrayBuffer())
      .then(buf => new File([buf], filename, { type }))
    );
  },
  _fileMD5(file) {
    return new Promise((resolve) => {
      const reader = FileReader();
      reader.addEventListener('load', () => {
        const wordArray = typedArraysLib.WordArray.create(this.result);
        resolve(md5(wordArray));
      });
      reader.readAsArrayBuffer(file);
    });
  },
  async _findFile(name, opts = { createIfNotFound: false }) {
    const { Content } = Vue.$FeathersVuex;
    if (name instanceof Content) return name;
    const currGroup = store.getters['groups/current']();
    if (!currGroup) throw new Error('Not operating in the context of any group.');
    let query = { groupId: currGroup._id, name };
    if (/^[0-9abcdef]{24}$/.test(name)) query = { groupId: currGroup._id, _id: name };
    // check the local store
    let res = store.getters['content/find']({ query }).data;
    if (res.length === 1) return new Content(res[0]);
    if (res.length) throw new Error('File description given is too vuage.');
    // check the remote store
    res = await store.dispatch('content/find', { query }).data;
    if (res.length === 1) return new Content(res[0]);
    if (res.length) throw new Error('File description given is too vuage.');
    // not found, so let's create
    if (!opts.createIfNotFound || query._id) throw new Error('Specified file was not found.');
    let cont = new Content({
      name,
      groupId: currGroup._id,
      perms: opts.perms || [],
      type: opts.type || undefined,
    });
    cont = await cont.save();
    return cont;
  },
  async _readReq(content) {
    const { name, presign } = content;
    const filename = name.split('/').pop();
    const res = await fetch(presign.url);
    return new File([await res.blob()], filename, res.headers['Content-Type']);
  },
  async _writeReq(content, payload) {
    // convert payload to file
    const { name, presign, type } = content;
    const filename = name.split('/').pop();
    let file = null;
    if (typeof payload === 'string') {
      if (/^((data:)|(https{0,1}:\/\/)|(s{0,1}ftp:\/\/))/.test(payload)) {
        payload = await this._urltoFile(payload, filename, type);
      } else payload = new Blob([payload], { type });
    }
    if (payload instanceof File) file = payload;
    else if (payload instanceof File) {
      file = new File([payload], filename, { lastModified: Date.now() });
    }
    if (!file) throw new Error('Unknown payload type.');
    // gen md5
    const filemd5 = this._fileMD5(file);

    // build request
    const fd = new FormData();
    presign.fields.forEach((v, i) => fd.append(i, v));
    fd.append('file', file);

    // send request
    await fetch(presign.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: fd,
    });
    await store.dispatch('content/patch', [content._id, { md5: filemd5 }]);
    return file;
  },
  async _getPresign(content, method) {
    const { Content } = Vue.$FeathersVuex;
    if (method === 'read') {
      if (content.presign && content.presign.expires > Date.now() && !content.presign.fields) {
        return content;
      }
      return new Content(await store.dispatch('content/get', [content._id]));
    } else if (method === 'write') {
      if (content.presign && content.presign.expires > Date.now() && content.presign.fields) {
        return content;
      }
      return new Content(await store.dispatch('content/patch', [content._id, {}]));
    }
    throw new Error('Unknown Method');
  },
  async readFile(name) {
    let content = await this._findFile(name);
    content = await this._getPresign(content, 'read');
    const file = await this._readReq(content);
    return file;
  },
  async createFile(name, payload, type, perms) {
    if (payload instanceof File) type = payload.type; // eslint-disable-line prefer-destructuring
    if (!type) throw new Error('Mime-Type must be specified when creating a file, either as an arg or passing a File as the payload.');
    let content = await this._findFile(name, { createIfNotFound: true, type, perms });
    content = await this._getPresign(content, 'read');
    const file = await this._writeReq(content, payload);
    return file;
  },
  async writeFile(name, payload) {
    let content = await this._findFile(name);
    content = await this._getPresign(content, 'read');
    const file = await this._writeReq(content, payload);
    return file;
  },
  async renameFile(name, newName) {
    const { Content } = Vue.$FeathersVuex;
    const content = await this._findFile(name);
    return new Content(await store.dispatch('content/patch', [content._id, { name: newName }]));
  },
  async deleteFile(name) {
    let content = await this._findFile(name);
    content = await content.remove();
    return content;
  },
  async copyFile(name, copyName) {
    const content = await this._findFile(name);
    content.copy = content._id;
    delete content._id;
    content.name = copyName;
    content.save();
  },
};


export default (() => {
  const plugin = {
    contentLib,
    install() {
      Object.defineProperty(Vue.prototype, '$content', {
        get() { return contentLib; },
      });
    },
  };
  Vue.use(plugin);
  return contentLib;
})();
