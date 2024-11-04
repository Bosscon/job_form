document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('jobApplicationForm');

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = new FormData(form);

        fetch('/api/submit', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            form.reset();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while submitting the form. Please try again.');
        });
    });
});