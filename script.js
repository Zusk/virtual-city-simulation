// List of possible first and last name parts for generating names
const firstNameParts = ['Blip', 'Gleep', 'Zorp', 'Gloob', 'Flarp', 'Bleep', 'Wubba', 'Dingle', 'Shleem', 'Flim'];
const lastNameParts = ['Blorp', 'Glop', 'Shmoop', 'Boop', 'Floob', 'Doop', 'Schnick', 'Florp', 'Gazorp', 'Moxie'];

const jobTypes = ['Studying', 'Working', 'Eating', 'Sleeping', 'Exploring', 'Inventing', 'Calculating', 'Meditating', 'Coding', 'Analyzing'];

let agents = [];

// Generate agents
function generateAgents(num) {
    for (let i = 0; i < num; i++) {
        let name = generateName();
        agents.push({
            id: i,
            name: name,
            job: null,
            duration: 0,
            partnerId: null
        });
    }
}

// Generate a random sci-fi name
function generateName() {
    let firstName = firstNameParts[Math.floor(Math.random() * firstNameParts.length)];
    let lastName = lastNameParts[Math.floor(Math.random() * lastNameParts.length)];
    return firstName + lastName;
}

// Assign jobs to agents
function assignJobs() {
    agents.forEach(agent => {
        if (agent.duration <= 0) {
            // 20% chance to assign a shared job
            if (Math.random() < 0.2 && agents.length >= 2) {
                assignSharedJob(agent);
            } else {
                assignSoloJob(agent);
            }
        }
    });
}

// Assign a solo job to an agent
function assignSoloJob(agent) {
    let jobType = jobTypes[Math.floor(Math.random() * jobTypes.length)];
    let duration = Math.floor(Math.random() * 100) + 1; // Duration between 1 and 100 ticks
    agent.job = jobType;
    agent.duration = duration;
    agent.partnerId = null;
}

// Assign a shared job to two agents
function assignSharedJob(agent) {
    // Find another agent who is available
    let availableAgents = agents.filter(a => a.id !== agent.id && a.duration <= 0);
    if (availableAgents.length > 0) {
        let partner = availableAgents[Math.floor(Math.random() * availableAgents.length)];
        let duration = Math.floor(Math.random() * 100) + 1;
        let jobType = 'Working with ' + partner.name;
        agent.job = jobType;
        agent.duration = duration;
        agent.partnerId = partner.id;

        // Assign the same job and duration to the partner
        partner.job = 'Working with ' + agent.name;
        partner.duration = duration;
        partner.partnerId = agent.id;
    } else {
        // If no partner is available, assign a solo job
        assignSoloJob(agent);
    }
}

// Update agent durations each tick
function tick() {
    let selectedAgent = getSelectedAgent();
    agents.forEach(agent => {
        if (agent.duration > 0) {
            agent.duration--;
        } else {
            assignJobs();
        }
    });
    displayAgentList();
    if (selectedAgent) {
        // Update agent details if an agent is selected
        let updatedAgent = agents.find(agent => agent.id === selectedAgent.id);
        displayAgentDetails(updatedAgent);
    }
}

// Display agent list
function displayAgentList() {
    const agentListDiv = document.getElementById('agent-list');
    agentListDiv.innerHTML = '';

    agents.forEach(agent => {
        let agentDiv = document.createElement('div');
        agentDiv.className = 'agent-item';
        agentDiv.textContent = `${agent.name} - ${agent.job || 'Idle'} - ${agent.duration} ticks`;
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
        <p><strong>Job:</strong> ${agent.job || 'Idle'}</p>
        <p><strong>Remaining Duration:</strong> ${agent.duration} ticks</p>
    `;
}

// Get the currently selected agent (if any)
let selectedAgentId = null;

function getSelectedAgent() {
    if (selectedAgentId !== null) {
        return agents.find(agent => agent.id === selectedAgentId);
    }
    return null;
}

// Initialize simulation
function init() {
    generateAgents(50); // Generate 50 agents
    assignJobs();
    displayAgentList();
    setInterval(() => {
        tick();
    }, 1000); // Each tick is 1 second
}

window.onload = init;

// Event listener to track selected agent
function displayAgentDetails(agent) {
    selectedAgentId = agent.id;
    const agentDetailsDiv = document.getElementById('agent-details');
    agentDetailsDiv.innerHTML = `
        <h2>Agent Details</h2>
        <p><strong>Name:</strong> ${agent.name}</p>
        <p><strong>Job:</strong> ${agent.job || 'Idle'}</p>
        <p><strong>Remaining Duration:</strong> ${agent.duration} ticks</p>
    `;
}
