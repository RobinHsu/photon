module.exports = [
  [/^\/admin\/(?!api).*$/, 'admin/index'],
  [/\/admin\/api\/(\w+)(?:\/(\d+))?/, 'admin/api/:1?id=:2', 'rest']
];
