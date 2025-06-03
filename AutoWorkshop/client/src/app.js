var app = new Vue({
  el: '#app',
  data: {
    services: [],
    loading: true,
    showAddServiceForm: false,
    showDeleteModal: false,
    deleteId: null,
    toastMessage: '',
    toastType: '',
    searchQuery: '',
    sortAsc: false,
    newService: {
      customerName: '',
      vehicleDetails: {
        make: '',
        model: '',
        year: '',
        vin: ''
      },
      serviceType: 'maintenance',
      serviceDescription: '',
      technicianAssigned: '',
      serviceStatus: 'pending',
      estimatedCost: 0,
      actualCost: 0,
      serviceDateTime: ''
    }
  },
  computed: {
    filteredServices() {
      let result = this.services.filter(s => {
        let q = this.searchQuery.toLowerCase();
        return (
          s.customerName.toLowerCase().includes(q) ||
          s.vehicleDetails.make.toLowerCase().includes(q) ||
          s.vehicleDetails.model.toLowerCase().includes(q) ||
          (s.serviceStatus && s.serviceStatus.toLowerCase().includes(q))
        );
      });
      result = result.sort((a, b) => {
        let da = new Date(a.serviceDateTime), db = new Date(b.serviceDateTime);
        return this.sortAsc ? da - db : db - da;
      });
      return result;
    }
  },
  methods: {
    loadServices: function() {
      this.loading = true;
      axios.get('http://localhost:3000/services')
        .then(response => {
          this.services = response.data;
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
          this.showToast('Error loading services!', 'error');
        });
    },
    addService: function() {
      if (!this.newService.customerName || !this.newService.vehicleDetails.make || !this.newService.vehicleDetails.model || !this.newService.serviceDateTime) {
        this.showToast('Please fill all required fields!', 'error');
        return;
      }
      axios.put('http://localhost:3000/services', this.newService)
        .then(response => {
          this.loadServices();
          this.showAddServiceForm = false;
          this.resetNewServiceForm();
          this.showToast('Service added successfully!', 'success');
        })
        .catch(error => {
          this.showToast('Error adding service!', 'error');
        });
    },
    confirmDelete: function(id) {
      this.deleteId = id;
      this.showDeleteModal = true;
    },
    deleteService: function(id) {
      axios.delete('http://localhost:3000/services/' + id)
        .then(response => {
          this.loadServices();
          this.showDeleteModal = false;
          this.showToast('Service deleted!', 'success');
        })
        .catch(error => {
          this.showToast('Error deleting service!', 'error');
        });
    },
    formatDate: function(dateString) {
      if (!dateString) return '-';
      const date = new Date(dateString);
      return date.toLocaleString();
    },
    resetNewServiceForm: function() {
      this.newService = {
        customerName: '',
        vehicleDetails: {
          make: '',
          model: '',
          year: '',
          vin: ''
        },
        serviceType: 'maintenance',
        serviceDescription: '',
        technicianAssigned: '',
        serviceStatus: 'pending',
        estimatedCost: 0,
        actualCost: 0,
        serviceDateTime: ''
      };
    },
    showToast: function(msg, type) {
      this.toastMessage = msg;
      this.toastType = type;
      setTimeout(() => { this.toastMessage = ''; }, 2500);
    },
    toggleSort: function() {
      this.sortAsc = !this.sortAsc;
    }
  },
  mounted: function() {
    this.loadServices();
  }
});
