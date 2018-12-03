/* eslint-disable object-curly-newline */
module.exports = {
  // images
  'image/png': { icon: 'file-image', ext: ['png'], view: 'image' },
  'image/jpeg': { icon: 'file-image', ext: ['jpg', 'jpeg'], view: 'image' },
  'image/gif': { icon: 'file-image', ext: ['gif'], view: 'image' },
  'image/svg+xml': { icon: 'file-image', ext: ['svg'], view: 'image', edit: 'text', opts: { lang: 'xml' } },
  // video files
  'video/mp4': { icon: 'file-video', ext: ['mp4', 'mpeg4'], view: 'video' },
  'video/x-flv': { icon: 'file-video', ext: ['flv'], view: 'video' },
  'video/x-motion-jpeg': { icon: 'file-video', ext: ['mjpg'], view: 'video' },
  // audio
  'audio/mpeg3': { icon: 'file-audio', ext: ['mp3', 'mpeg3'], view: 'audio' },
  'audio/x-wav': { icon: 'file-audio', ext: ['wav'], view: 'audio' },
  // archives
  'application/zip': { icon: 'file-archive', ext: ['zip'], view: 'download' },
  'application/x-gzip': { icon: 'file-archive', ext: ['gzip'], view: 'download' },
  'application/x-tar': { icon: 'file-archive', ext: ['tar'], view: 'download' },
  'application/x-7z-compressed': { icon: 'file-archive', ext: ['7z'], view: 'download' },
  // data
  'application/json': { icon: 'file-spreadsheet', ext: ['json'], view: 'text', edit: 'text', opts: { lang: 'json' } },
  'text/csv': { icon: 'file-spreadsheet', ext: ['csv'], view: 'text', edit: 'text', opts: { lang: 'csv' } },
  'text/plain': { icon: 'file-alt', ext: ['txt', 'text'], view: 'text', edit: 'text', opts: { lang: 'text' } },
  'text/tab-separated-values': { icon: 'file-spreadsheet', ext: ['tsv'], view: 'text', edit: 'text', opts: { lang: 'tsv' } },
  // docs
  'application/pdf': { icon: 'file-spreadsheet', ext: ['pdf'], view: 'pdf' },
  'application/x-latex': { icon: 'file-invoice', ext: ['latex'], view: 'text', edit: 'text', opts: { lang: 'latex' } },
  'text/markdown': { icon: 'file-invoice', ext: ['md'], view: 'markdown', edit: 'markdown' },
  // ms docs
  'application/msword': { icon: 'file-word', ext: ['doc', 'dot'], view: 'download' },
  'application/vnd.ms-excel': { icon: 'file-spreadsheet', ext: ['xls', 'xlt', 'xla'], view: 'download' },
  'application/vnd.ms-powerpoint': { icon: 'file-powerpoint', ext: ['ppt', 'ppa', 'pps', 'pot'], view: 'download' },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { icon: 'file-word', ext: ['docx'], view: 'download' },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.template': { icon: 'file-word', ext: ['dotx'], view: 'download' },
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { icon: 'file-spreadsheet', ext: ['xlsx'], view: 'download' },
  'application/vnd.openxmlformats-officedocument.spreadsheetml.template': { icon: 'file-spreadsheet', ext: ['xltx'], view: 'download' },
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': { icon: 'file-powerpoint', ext: ['pptx'], view: 'download' },
  'application/vnd.openxmlformats-officedocument.presentationml.template': { icon: 'file-powerpoint', ext: ['potx'], view: 'download' },
  'application/vnd.openxmlformats-officedocument.presentationml.slideshow': { icon: 'file-powerpoint', ext: ['ppsx'], view: 'download' },
  // code
  'application/x-javascript': { icon: 'js', stack: true, ext: ['js'], view: 'text', edit: 'text', opts: { lang: 'js' } },
  'text/css': { icon: 'css', stack: true, ext: ['css'], view: 'text', edit: 'text', opts: { lang: 'css' } },
  'text/x-script.python': { icon: 'python', stack: true, ext: ['py'], view: 'text', edit: 'text', opts: { lang: 'python' } },
  'application/x-bytecode.python': { icon: 'cogs', stack: true, ext: ['pyc'], view: 'download' },
  'text/x-java-source': { icon: 'java', stack: true, ext: ['java', 'jav'], view: 'text', edit: 'text', opts: { lang: 'java' } },
  'application/java-archive': { icon: 'cogs', stack: true, ext: ['jar'], view: 'download' },
  // misc
  'text/uri-list': { icon: 'external-link-square', ext: ['uni', 'uri'], view: 'link' },
  'text/x-comment': { icon: 'comment-alt-lines', stack: true, ext: ['comment'], view: 'markdown', edit: 'markdown' },
  'text/x-directory': { icon: 'folder', ext: ['directory'], view: 'directory' },
};
