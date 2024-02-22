const {createLogger,format,transports} = require('winston');

const logger = createLogger({
  level: 'info',
//   format: format.json(),
  format: format.combine(
                    format.colorize(),
                    format.timestamp({format:'YYYY-MM-DD HH:mm:ss'}),
                    format.simple(),
                    format.json()
                    ),
  transports: [ 
    // new transports.File({ filename: 'error.log', level: 'error' }),
    // new transports.File({ filename: 'combined.log' }),
    // show log info in terminal
    // new transports.Console({
    //     format: format.combine(format.colorize(),format.simple())
    // }),
    new transports.File({
        filename:'src/logs/info.log',
        level:'info',
        maxsize:5242880,//5MB,
        // maxFiles:5,
    }),
    // useing for error
    new transports.File({
        filename:'src/logs/error.log',
        level:'error',
        maxsize:5242880,//5MB,
        // maxFiles:5,
    })
  ],
});


module.exports =  logger;
