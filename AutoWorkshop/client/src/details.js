function run() {
    new Vue({
      el: '#details',
      data: {
        service: null
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
        formatDate(dateString) {
          if (!dateString) return '-';
          const date = new Date(dateString);
          return date.toLocaleString();
        }
      }
    });
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    run();
  });
  