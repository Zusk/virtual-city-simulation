// List of possible first and last name parts for generating names
const firstNameParts = ['Blip', 'Gleep', 'Zorp', 'Gloob', 'Flarp', 'Bleep', 'Wubba', 'Dingle', 'Shleem', 'Flim'];
const lastNameParts = ['Blorp', 'Glop', 'Shmoop', 'Boop', 'Floob', 'Doop', 'Schnick', 'Florp', 'Gazorp', 'Moxie'];

const jobTypes = ['Studying', 'Working', 'Eating', 'Sleeping', 'Exploring', 'Inventing', 'Calculating', 'Meditating', 'Coding', 'Analyzing'];

const locations = ['Central Plaza', 'Tech Hub', 'Library', 'Research Lab', 'Park', 'Marketplace', 'Residential Area', 'Industrial Zone', 'Harbor', 'Spaceport', 'Entertainment District', 'Government Center'];

let agents = [];

// Generate agents
function generateAgents(num) {
    for (let i = 0; i < num; i++) {
        let name = generateName();
        let location = assignLocation(name);
        agents.push({
            id: i,
            name: name,
            job: null,
            duration: 0,
            partnerId: null,
            isJobOwner: true, // Default to true
            location: location
        });
    }
}

// Generate a random sci-fi name
function generateName() {
    let firstName = firstNameParts[Math.floor(Math.random() * firstNameParts.length)];
    let lastName = lastNameParts[Math.floor(Math.random() * lastNameParts.length)];
    return firstName + lastName;
}

// Assign a location based on a hash of the agent's name
function assignLocation(name) {
    let hash = hashString(name);
    let index = hash % locations.length;
    return locations[index];
}

// Simple hash function for strings
function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
}

// Assign jobs to agents
function assignJobs() {
    agents.forEach(agent => {
        if (agent.duration <= 0) {
            // 20% chance to initiate a shared job
            if (Math.random() < 0.2) {
                initiateSharedJob(agent);
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
    agent.isJobOwner = true;
}

// Initiate a shared job, only with agents on solo jobs
function initiateSharedJob(agent) {
    // Find agents who are on solo jobs
    let potentialPartners = agents.filter(a => a.id !== agent.id && a.partnerId === null);
    if (potentialPartners.length > 0) {
        let partner = potentialPartners[Math.floor(Math.random() * potentialPartners.length)];
        let duration = Math.floor(Math.random() * 100) + 1;
        let jobType = 'Working with ' + partner.name;
        agent.job = jobType;
        agent.duration = duration;
        agent.partnerId = partner.id;
        agent.isJobOwner = true;

        // Interrupt partner's current solo job
        partner.job = 'Working with ' + agent.name;
        partner.duration = duration;
        partner.partnerId = agent.id;
        partner.isJobOwner = false;
    } else {
        // If no partner is available, assign a solo job
        assignSoloJob(agent);
    }
}

// Update agent durations each tick
function tick() {
    agents.forEach(agent => {
        if (agent.duration > 0 && agent.isJobOwner) {
            agent.duration--;

            // Synchronize partner's duration if in a shared job
            if (agent.partnerId !== null) {
                let partner = agents.find(a => a.id === agent.partnerId);
                if (partner) {
                    partner.duration = agent.duration;
                    if (partner.job !== 'Working with ' + agent.name) {
                        partner.job = 'Working with ' + agent.name;
                    }
                }
            }
        } else if (agent.duration <= 0) {
            // Assign new job if duration is 0
            assignJobs();
        }
    });
    displayAgentList();
    updateAgentDetails();
}

// Display agent list
function displayAgentList() {
    const agentListDiv = document.getElementById('agent-list');
    agentListDiv.innerHTML = '';

    agents.forEach(agent => {
        let agentDiv = document.createElement('div');
        agentDiv.className = 'agent-item';
        agentDiv.textContent = `${agent.name} - ${agent.job || 'Idle'} - ${agent.location} - ${agent.duration} ticks`;
        agentDiv.addEventListener('click', () => {
            selectedAgentId = agent.id;
            displayAgentDetails(agent);
        });
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
        <p><strong>Location:</strong> ${agent.location}</p>
    `;
}

// Update agent details if an agent is selected
function updateAgentDetails() {
    if (selectedAgentId !== null) {
        let agent = agents.find(a => a.id === selectedAgentId);
        if (agent) {
            displayAgentDetails(agent);
        }
    }
}

// Get the currently selected agent (if any)
let selectedAgentId = null;

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
