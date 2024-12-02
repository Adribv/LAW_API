const noble = require('noble');

// Start scanning for Bluetooth devices
noble.on('stateChange', (state) => {
  if (state === 'poweredOn') {
    console.log('Scanning for Bluetooth devices...');
    noble.startScanning(); // Start scanning for all BLE devices
  } else {
    noble.stopScanning();
  }
});

// When a Bluetooth device is discovered
noble.on('discover', (peripheral) => {
  console.log(`Discovered device: ${peripheral.advertisement.localName}`);

  // Stop scanning once we find the first device
  noble.stopScanning();

  console.log(`Connecting to ${peripheral.advertisement.localName}...`);

  peripheral.connect((error) => {
    if (error) {
      console.error(`Failed to connect: ${error}`);
      return;
    }

    console.log('Connected!');

    // Discover the services and characteristics of the connected device
    peripheral.discoverServices([], (error, services) => {
      if (error) {
        console.error('Error discovering services:', error);
        return;
      }

      services.forEach((service) => {
        // Once a service is discovered, start reading its characteristics
        service.discoverCharacteristics([], (error, characteristics) => {
          if (error) {
            console.error('Error discovering characteristics:', error);
            return;
          }

          characteristics.forEach((characteristic) => {
            // Subscribe to data from the first characteristic
            characteristic.on('data', (data, isNotification) => {
              console.log('Received Data:', data.toString()); // Log the data received
            });

            // Subscribe to notifications (this will allow continuous data updates)
            characteristic.subscribe((error) => {
              if (error) {
                console.error('Failed to subscribe:', error);
              } else {
                console.log('Subscribed to notifications');
              }
            });
          });
        });
      });
    });
  });
});
