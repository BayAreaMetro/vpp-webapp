/*jslint node: true */
'use strict';

console.log('loading production database');

// Production specific configuration
// =================================
module.exports = {
  // Server IP
  ip:       process.env.OPENSHIFT_NODEJS_IP ||
            process.env.IP ||
            undefined,

  // Server port
  port:     process.env.OPENSHIFT_NODEJS_PORT ||
            process.env.PORT ||
            8080,

  // MSSQL connection options
  mssql: {
    ip: '54.201.106.213'   
  }
};
