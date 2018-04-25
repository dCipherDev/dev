imu = require('node-sense-hat').Imu

IMU = new imu.IMU()
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

//setInterval(() => {

//lineCount = lineCount + 1;
IMU.getValue((err, data) => {
        if(err != null) {
                console.error('Could not read sensor data: ', err)
                return
        }

        console.log('Temp is: ', data.temperature)
        console.log('Pressure is: ', data.pressure)
        console.log('Humidity is: ', data.humidity)
        //await sleep(2000);
    }, 50);
//});