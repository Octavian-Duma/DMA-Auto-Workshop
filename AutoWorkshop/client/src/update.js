function run() {
    new Vue({
      el: '#update',
      data: {
        service: null,
        message: ''
      },
      created: function () {
        let params = new URLSearchParams(window.location.search.substring(1));
        let id = params.get('id');
        axios.get('http://localhost:3000/services/' + id)
          .then(response => {
            this.service = response.data;
          });
      },
      methods: {
        updateService() {
          axios.post('http://localhost:3000/services', this.service)
            .then(response => {
              this.message = 'Service updated successfully!';
            })
            .catch(error => {
              this.message = 'Error updating service!';
            });
        }
      }
    });
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    run();
  });
  