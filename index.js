document.getElementById('myButton').addEventListener('click', function() {
    const input = document.getElementById('myInput').value;
    const output = document.getElementById('output');
    
    if (input) {
        output.textContent = `You entered: ${input}`;
    } else {
        output.textContent = 'Please enter something!';
    }
});