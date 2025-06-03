var api = require('./src/api.js').app;
const fs = require('fs');
const servicesFilepath = './src/services.json';

api.get('/', function (request, response) {
  response.json('DMA Auto Workshop - Service Management API');
});

// Get all service appointments
api.get('/services', function (request, response) {
  response.json(getServices());
});

// Get service by ID
api.get('/services/:id', function (request, response) {
  let service = getServiceById(request.params.id);
  if (service) response.json(service);
  response.json('Service not found');
});

// Create new service appointment
api.put('/services', function (request, response) {
  saveService(request.body);
  response.json('Service appointment was saved successfully');
});

// Update existing service
api.post('/services', function (request, response) {
  let service = request.body;
  let services = getServices();
  
  for(let i=0; i < services.length; i++) {
    if (services[i].id === service.id) {
      services[i] = service;
    }
  }

  try {
    fs.writeFileSync(servicesFilepath, JSON.stringify(services));
  } catch (err) {
    console.error(err)
  }

  response.json('Service was updated successfully');
});

// Delete service
api.delete('/services/:id', function (request, response) {
  let services = getServices();
  services = services.filter(service => service.id !== parseInt(request.params.id));
  
  try {
    fs.writeFileSync(servicesFilepath, JSON.stringify(services));
    response.json('Service was deleted successfully');
  } catch (err) {
    console.error(err);
    response.status(500).json('Error deleting service');
  }
});

api.listen(3000, function () {
  console.log('DMA Auto Workshop Server running @ localhost:3000');
});

function getServices() {
  let services = [];
  try {
    services = JSON.parse(fs.readFileSync(servicesFilepath, 'utf8'));
  } catch (err) {
    console.error(err);
    return [];
  }
  return services;
}

function saveService(service) {
  let services = getServices();
  let maxId = getMaxId(services);
  service.id = maxId + 1;
  services.push(service);
  try {
    fs.writeFileSync(servicesFilepath, JSON.stringify(services));
  } catch (err) {
    console.error(err)
  }
}

function getMaxId(services) {
  let max = 0;
  for (var i=0; i<services.length; i++) {
    if(max < services[i].id) {
      max = services[i].id;
    }
  }
  return max;
}

function getServiceById(id){
  let services = getServices();
  let selectedService = null;
  for(var i=0; i<services.length; i++) {
    if(id == services[i].id) selectedService = services[i];
  }
  return selectedService;
}
