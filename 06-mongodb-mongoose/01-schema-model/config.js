module.exports = {
  mongodb: {
    uri: (process.env.NODE_ENV === 'test' ?
      'mongodb://127.0.0.1:27017/6-module-1-task' :
      'mongodb://192.168.1.78:27017/6-module-1-task'),
  },
};
