document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('jobApplicationForm');

    form.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent the default form submission

        if (validateForm()) {
            // If the form is valid, submit it using fetch
            fetch(form.action, {
                method: form.method,
                body: new FormData(form)
            })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    alert(data.message); // Show success message
                    form.reset(); // Reset the form
                } else {
                    throw new Error('Submission failed');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while submitting the form. Please try again.');
            });
        } else {
            alert('Please fill out all required fields correctly.');
        }
    });

    function validateForm() {
        let isValid = true;
        
        // Check all required inputs
        form.querySelectorAll('[required]').forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('border-red-500');
            } else {
                input.classList.remove('border-red-500');
            }
        });

        // Additional validation can be added here
        // For example, validate email format, SSN format, etc.

        return isValid;
    }
});