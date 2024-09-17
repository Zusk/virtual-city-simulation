// List of possible first and last name parts for generating names
const firstNameParts = [
    'Blip', 'Gleep', 'Zorp', 'Gloob', 'Flarp', 'Bleep', 'Wubba', 'Dingle', 'Shleem', 'Flim',
    'Zibble', 'Krunk', 'Ploop', 'Vreep', 'Snarg', 'Mibble', 'Plink', 'Tweep', 'Griz', 'Zaddle',
    'Thib', 'Snibble', 'Glorg', 'Tlep', 'Brong', 'Zlub', 'Plop', 'Wrangle', 'Drib', 'Skree',
    'Chorp', 'Tizz', 'Yip', 'Glibb', 'Flonk', 'Sprag', 'Tig', 'Preep', 'Zint', 'Runk',
    'Jorp', 'Quib', 'Vlop', 'Nerg', 'Trundle', 'Crimp', 'Whib', 'Mug', 'Vink', 'Plonk',
    'Squib', 'Pring', 'Garg', 'Blimp', 'Vizz', 'Drong', 'Glip', 'Fribble', 'Tronk', 'Whob',
    'Lorp', 'Yomp', 'Nerp', 'Klib', 'Gorp', 'Zump', 'Riddle', 'Throg', 'Blerg', 'Krib',
    'Mizz', 'Skloop', 'Wimble', 'Pibble', 'Frob', 'Gribble', 'Slomp', 'Nizz', 'Clunk', 'Vrop',
    'Tronk', 'Sprock', 'Yorb', 'Flunk', 'Snug', 'Zug', 'Dorf', 'Klep', 'Brindle', 'Clong'
];

const lastNameParts = [
    'Blorp', 'Glop', 'Shmoop', 'Boop', 'Floob', 'Doop', 'Schnick', 'Florp', 'Gazorp', 'Moxie',
    'Throb', 'Grunk', 'Plop', 'Zibble', 'Snork', 'Mizzle', 'Drub', 'Prang', 'Glug', 'Vrob',
    'Twizzle', 'Snag', 'Glorp', 'Flib', 'Wub', 'Crangle', 'Zonk', 'Bizzle', 'Gribble', 'Splunk',
    'Vreep', 'Tronk', 'Nibble', 'Frizzle', 'Bomp', 'Wrag', 'Drip', 'Snip', 'Thwop', 'Crizzle',
    'Splick', 'Yuzz', 'Tribble', 'Snerk', 'Ploom', 'Wribble', 'Grank', 'Snarp', 'Jank', 'Miffle',
    'Quop', 'Flick', 'Sloop', 'Brip', 'Glimp', 'Zlop', 'Thunk', 'Flizzle', 'Mub', 'Trop',
    'Yorp', 'Vlip', 'Sprog', 'Wham', 'Chizzle', 'Grunkle', 'Tribble', 'Zlang', 'Yob', 'Snorg',
    'Plunk', 'Tizzle', 'Groop', 'Wump', 'Friz', 'Wibble', 'Crunk', 'Glonk', 'Tharp', 'Yub',
    'Flob', 'Mizzle', 'Chorp', 'Vlip', 'Dop', 'Zlick', 'Gluff', 'Wrizzle', 'Bop', 'Krang'
];

const jobTypes = ['Studying', 'Working', 'Eating', 'Sleeping', 'Exploring', 'Inventing', 'Calculating', 'Meditating', 'Coding', 'Analyzing'];

const locations = ['Central Plaza', 'Tech Hub', 'Library', 'Research Lab', 'Park', 'Marketplace', 'Residential Area', 'Industrial Zone', 'Harbor', 'Spaceport', 'Entertainment District', 'Government Center'];

let agents = [];

// Generate agents
function generateAgents(num) {
    for (let i = 0; i < num; i++) {
        let name = generateName();
        let preferredLocation = assignPreferredLocation(name);
        let preferredJob = assignPreferredJob(name);
        agents.push({
            id: i,
            name: name,
            job: null,
            duration: 0,
            partnerId: null,
            isJobOwner: true, // Default to true
            location: null,
            preferredLocation: preferredLocation,
            preferredJob: preferredJob
        });
    }
}

// Generate a random sci-fi name
function generateName() {
    let firstName = firstNameParts[Math.floor(Math.random() * firstNameParts.length)];
    let lastName = lastNameParts[Math.floor(Math.random() * lastNameParts.length)];
    return firstName + lastName;
}

// Assign a preferred location based on a hash of the agent's name
function assignPreferredLocation(name) {
    let hash = hashString(name);
    let index = hash % locations.length;
    return locations[index];
}

// Assign a preferred job based on a hash of the agent's name
function assignPreferredJob(name) {
    let hash = hashString(name + 'job'); // Different hash than location
    let index = hash % jobTypes.length;
    return jobTypes[index];
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

// Weighted random selection
function weightedRandomChoice(preferred, options, weight) {
    let weightedOptions = [];
    options.forEach(option => {
        let count = option === preferred ? weight : 1;
        for (let i = 0; i < count; i++) {
            weightedOptions.push(option);
        }
    });
    return weightedOptions[Math.floor(Math.random() * weightedOptions.length)];
}

// Assign jobs to agents
function assignJobs() {
    agents.forEach(agent => {
        if (agent.duration <= 0) {
            // Assign a location with weighted randomness
            agent.location = weightedRandomChoice(agent.preferredLocation, locations, 5); // Weight of 5 for preferred location

            // 20% chance to initiate a shared job
            if (Math.random() < 0.2) {
                initiateSharedJob(agent);
            } else {
                assignSoloJob(agent);
            }
        }
    });
}

// Assign a solo job to an agent with weighted preference
function assignSoloJob(agent) {
    let jobType = weightedRandomChoice(agent.preferredJob, jobTypes, 3); // Weight of 3 for preferred job
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

        // Bring partner to initiator's location
        partner.location = agent.location;

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
                    // Ensure partner's job and location are updated
                    partner.job = 'Working with ' + agent.name;
                    partner.location = agent.location;
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
        agentDiv.textContent = `${agent.name} - ${agent.job || 'Idle'} - ${agent.duration} ticks - ${agent.location}`;
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
