import bunyan from 'bunyan';

// Create a custom pretty-print stream for development
const createPrettyStream = () => {
    return {
        write: (record: any) => {
            const log = JSON.parse(record);
            const timestamp = new Date(log.time).toISOString();

            console.log(`\n[${timestamp}] ${log.level} - ${log.name}:`);

            if (log.msg) {
                console.log(`Message: ${log.msg}`);
            }

            if (log.req) {
                console.log(`Request: ${log.req.method} ${log.req.url}`);
                if (log.req.body) {
                    console.log(`Body: ${JSON.stringify(log.req.body, null, 2)}`);
                }
            }

            if (log.res) {
                console.log(`Response: ${log.res.statusCode}`);
            }

            if (log.err) {
                console.log(`Error: ${log.err.message}`);
                console.log(`Stack: ${log.err.stack}`);
            }

            console.log('─'.repeat(80));
        }
    };
};

const streams = [
    {
        level: bunyan.INFO,
        stream: process.env.NODE_ENV === 'production'
            ? process.stdout
            : createPrettyStream(),
    },
];

/**
 * Log levels- fatal(60), error(50), warn(40), info(30), debug(20), trace(10)
 * Setting a logger instance (or one of its streams) to a particular level
 * implies that all log records at that level and above are logged.
 * E.g. a logger set to level "info" will log records at level info
 * and above (warn, error, fatal).
 */
const logger = bunyan.createLogger({
    name: 'vidur-autentication-server',
    streams,
    serializers: bunyan.stdSerializers,
});

export default logger;