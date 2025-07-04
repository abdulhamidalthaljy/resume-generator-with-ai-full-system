const io = require('socket.io-client');

// Connect to the backend server
const socket = io('http://localhost:5050');

socket.on('connect', () => {
    console.log('Connected to server with ID:', socket.id);

    // Emit a user join event
    socket.emit('user_join', {
        user: 'Test User',
        timestamp: new Date()
    });

    // Emit a resume created event
    setTimeout(() => {
        socket.emit('resume_created', {
            user: 'Test User',
            resumeTitle: 'Test Resume',
            timestamp: new Date()
        });
    }, 2000);

    // Emit a template change event
    setTimeout(() => {
        socket.emit('template_change', {
            user: 'Test User',
            oldTemplate: 'Classic',
            newTemplate: 'Modern',
            timestamp: new Date()
        });
    }, 4000);
});

socket.on('user_activity', (data) => {
    console.log('User Activity:', data);
});

socket.on('resume_activity', (data) => {
    console.log('Resume Activity:', data);
});

socket.on('user_count', (count) => {
    console.log('Connected Users:', count);
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
});

// Keep the script running
setTimeout(() => {
    socket.disconnect();
    process.exit(0);
}, 10000);
