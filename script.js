// List of possible first and last name parts for generating names
const firstNameParts = ['Blip', 'Gleep', 'Zorp', 'Gloob', 'Flarp', 'Bleep', 'Wubba', 'Dingle', 'Shleem', 'Flim'];
const lastNameParts = ['Blorp', 'Glop', 'Shmoop', 'Boop', 'Floob', 'Doop', 'Schnick', 'Florp', 'Gazorp', 'Moxie'];

const jobTypes = ['Studying', 'Working', 'Eating', 'Sleeping', 'Exploring', 'Inventing', 'Calculating', 'Meditating', 'Coding', 'Analyzing'];

let agents = [];

// Generate agents
function generateAgents(num) {
    for (let i = 0; i < num; i++) {
        let name = generateName();
        let job = assignJob();
        agents.push({
            id: i,
            name: name,
            job: job.type,
            duration: job.duration
        });
    }
}

// Generate a random sci-fi name
function generateName() {
    let firstName = firstNameParts[Math.floor(Math.random() * firstNameParts.length)];
    let lastName = lastNameParts[Math.floor(Math.random() * lastNameParts.length)];
    return firstName + lastName;
}

// Assign a random job with random duration
function assignJob() {
    let jobType = jobTypes[Math.floor(Math.random() * jobTypes.length)];
    let duration = Math.floor(Math.random() * 100) + 1; // Duration between 1 and 100 ticks
    return { type: jobType, duration: duration };
}

// Update agent durations each tick
function tick() {
    agents.forEach(agent => {
        if (agent.duration > 0) {
            agent.duration--;
        } else {
            // Assign new job if duration is 0
            let newJob = assignJob();
            agent.job = newJob.type;
            agent.duration = newJob.duration;
        }
    });
}

// Display agent list
function displayAgentList() {
    const agentListDiv = document.getElementById('agent-list');
    agentListDiv.innerHTML = '';

    agents.forEach(agent => {
        let agentDiv = document.createElement('div');
        agentDiv.textContent = agent.name;
        agentDiv.addEventListener('click', () => displayAgentDetails(agent));
        agentListDiv.appendChild(agentDiv);
    });
}

// Display agent details
function displayAgentDetails(agent) {
    const agentDetailsDiv = document.getElementById('agent-details');
    agentDetailsDiv.innerHTML = `
        <h2>Agent Details</h2>
        <p><strong>Name:</strong> ${agent.name}</p>
        <p><strong>Job:</strong> ${agent.job}</p>
        <p><strong>Remaining Duration:</strong> ${agent.duration} ticks</p>
    `;
}

// Initialize simulation
function init() {
    generateAgents(50); // Generate 50 agents
    displayAgentList();
    setInterval(() => {
        tick();
    }, 1000); // Each tick is 1 second
}

window.onload = init;

