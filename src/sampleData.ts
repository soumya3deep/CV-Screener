import { CandidateCV } from './types';

export interface SampleJobDescription {
  id: string;
  title: string;
  category: string;
  text: string;
}

export const SAMPLE_JOB_DESCRIPTIONS: SampleJobDescription[] = [
  {
    id: 'solar_epc_lead',
    title: 'Lead Solar PV Design & EPC Project Engineer',
    category: 'Solar Engineering',
    text: `Job Title: Lead Solar PV Design & EPC Project Engineer
Location: Sunjet Energy Headquarters / Site Deployments
Employment Type: Full-Time

About Sunjet Energy:
Sunjet Energy is a premier solar energy infrastructure and EPC solutions provider delivering utility-scale, commercial, and industrial photovoltaic installations across India.

Role Summary:
We are seeking an experienced Lead Solar PV Design & EPC Project Engineer to head our solar engineering design and technical execution pipeline. You will be responsible for end-to-end electrical design, yield simulations, equipment sizing (modules, inverters, transformers), balance of system (BOS), and substation grid interconnection.

Key Responsibilities:
• Lead solar PV layout engineering, shadow analysis, string sizing, and 3D modeling using PVsyst, Helioscope, and AutoCAD.
• Design single-line diagrams (SLD), 33kV/66kV/132kV evacuation systems, earthing, lightning protection, and AC/DC cable sizing.
• Conduct bankable energy generation yield assessments, P50/P90 generation probability studies, and loss estimation.
• Prepare detailed Bills of Quantities (BOQ), technical equipment procurement specifications, and vendor tender evaluations.
• Ensure compliance with Indian Central Electricity Authority (CEA) regulations, grid codes, IEC/IEEE standards, and local DISCOM interconnection norms.
• Collaborate with civil, structural, and procurement teams to optimize cost per watt-peak (Wp) and project timeline.
• Supervise factory acceptance tests (FAT), site acceptance testing, and final plant commissioning.

Required Qualifications & Skills:
• Bachelor's or Master's degree in Electrical Engineering, Renewable Energy, or Power Systems.
• 5+ years of demonstrable hands-on experience in ground-mount and utility-scale solar PV system design (minimum 25MW+ cumulative project experience).
• Expert-level proficiency in PVsyst, AutoCAD, Helioscope, and Microsoft Excel.
• Deep understanding of central vs string inverter architectures, bifacial module technology, and single-axis solar trackers.
• Working knowledge of SCADA, weather monitoring stations (WMS), and grid curtailment mitigation.
• Strong analytical, project management, and cross-functional team leadership capabilities.`
  },
  {
    id: 'solar_scada_dev',
    title: 'Senior Software Engineer - Solar SCADA & Energy IoT',
    category: 'Software & Data',
    text: `Job Title: Senior Software Engineer - Solar SCADA & Energy IoT
Location: Sunjet Energy Digital Ops
Employment Type: Full-Time

Role Summary:
Sunjet Energy is building an in-house real-time solar plant telematics and predictive maintenance platform. We are looking for a Senior Software Engineer to build high-throughput data telemetry pipelines, edge gateway integrations (Modbus, OPC-UA, MQTT), and cloud-based analytics dashboards.

Key Responsibilities:
• Architect real-time IoT ingestion pipelines for solar inverters, pyranometers, energy meters, and weather stations.
• Develop performant web applications and data visualization dashboards using TypeScript, React, Node.js, and Python.
• Integrate industrial IoT protocols: Modbus TCP/RTU, RS485, OPC-UA, and MQTT into edge collectors.
• Implement predictive anomaly detection algorithms for soiling losses, string failures, and inverter thermal throttling.
• Design clean REST APIs and WebSocket endpoints for low-latency SCADA control rooms.

Required Qualifications:
• 4+ years software engineering experience with TypeScript, Python, Node.js, and modern React.
• Practical familiarity with timeseries databases (TimescaleDB, InfluxDB, PostgreSQL) and message brokers (Kafka/RabbitMQ).
• Familiarity with renewable energy monitoring, solar irradiance data, or industrial telemetry protocols is a strong advantage.`
  },
  {
    id: 'solar_om_manager',
    title: 'Solar Operations & Maintenance (O&M) Manager',
    category: 'Operations',
    text: `Job Title: Solar Operations & Maintenance (O&M) Manager
Location: Regional Solar Plant Cluster
Employment Type: Full-Time

Role Summary:
Oversee the operational uptime, warranty management, preventive maintenance, and performance ratio (PR) guarantees of 150MWp of operating solar assets for Sunjet Energy.

Key Responsibilities:
• Lead on-site technicians and scheduled preventive/corrective maintenance for transformers, inverters, and tracker systems.
• Track and analyze daily plant Performance Ratio (PR), Generation Availability, and Grid Availability.
• Manage module cleaning schedules, thermographic drone inspections, and I-V curve testing.
• Coordinate with DISCOMs and state load dispatch centers (SLDC) for grid downtime scheduling.
• Enforce strict workplace health, safety, and environmental (EHS) protocols across all solar sites.

Required Qualifications:
• B.Tech in Electrical Engineering with 6+ years in operational utility-scale solar plants.
• Certified in High Voltage safety and thermography testing.
• Strong command of SCADA monitoring systems, CMMS software, and warranty claim procedures.`
  }
];

export const SAMPLE_CANDIDATES: CandidateCV[] = [
  {
    id: 'cand-1',
    name: 'Rajesh Sharma',
    fileName: 'Rajesh_Sharma_Lead_Solar_Engineer.pdf',
    source: 'sample',
    content: `RAJESH SHARMA, B.Tech (Electrical Engineering, IIT Roorkee)
Senior Solar Design & EPC Specialist | 8+ Years Experience
Email: rajesh.sharma.solar@example.com | Phone: +91 98765 43210 | Location: New Delhi / Bengaluru

EXECUTIVE PROFILE:
High-performing Solar Engineering Specialist with over 8 years of dedicated experience in utility-scale (ground-mount 10MW to 150MW) and commercial rooftop solar projects. Spearheaded design, PVsyst simulations, and commissioning for over 220MWp of cumulative commissioned solar capacity across Rajasthan, Gujarat, and Karnataka.

CORE COMPETENCIES & TECHNICAL PROFICIENCIES:
• Software: PVsyst (Expert), AutoCAD (2D/3D), Helioscope, ETAP, SketchUp, MS Excel modeling
• Engineering: Single Line Diagram (SLD), 33kV/66kV/132kV Substation Interconnection, AC/DC Cable Sizing, Earthing Grid Design
• Systems: Central Inverter & String Inverter layouts, Bifacial Modules, Single-Axis Trackers, Transformer sizing
• Compliance: CEA Technical Standards, Central Electricity Grid Code, IEC 62446, IEEE 1547, local DISCOM approvals
• Project Execution: Bankable P50/P90 Yield Reports, BOQ generation, Vendor Technical Evaluations, Pre-commissioning testing

PROFESSIONAL EXPERIENCE:
1. Sterling & Wilson Solar — Lead Technical PV Designer (2020 – Present)
• Directed engineering design team for 120MWp utility solar park in Bhadla, Rajasthan.
• Performed comprehensive PVsyst bankable energy yield simulations achieving 99.2% alignment with actual first-year generation.
• Optimized DC:AC overloading ratio (1.38x) using bifacial n-type TOPCon modules and 1P horizontal single-axis trackers.
• Authored comprehensive BOQ, cable schedule, and loss budget analysis that lowered overall BOS capital expenditure by 4.2%.

2. Tata Power Solar — Senior PV Design Engineer (2016 – 2020)
• Prepared complete electrical design packages including DC string layouts, junction boxes, and inverter station connections.
• Collaborated with state utility transmission engineers for 33kV bay design and DISCOM grid compliance inspections.
• Mentored 6 junior electrical engineers on PVsyst shading calculations and IEC design safety guidelines.

EDUCATION & CERTIFICATIONS:
• B.Tech in Electrical Engineering, IIT Roorkee (First Class with Distinction, 2016)
• Certified Solar PV System Designer (National Institute of Solar Energy - NISE)
• High-Voltage Grid Interconnection Safety Certification`
  },
  {
    id: 'cand-2',
    name: 'Priya Venkatesh',
    fileName: 'Priya_Venkatesh_Electrical_Design.pdf',
    source: 'sample',
    content: `PRIYA VENKATESH, M.Tech Power Systems (NIT Trichy)
Electrical Design Engineer (Solar & Power Infrastructure) | 5 Years Experience
Email: p.venkatesh.power@example.com | Location: Chennai / Hyderabad

SUMMARY:
Dedicated Electrical Engineer with 5 years of comprehensive experience specializing in power systems analysis, substation engineering, and solar plant electrical design. Proven expertise in AutoCAD electrical drawings, single line diagrams, cable ampacity calculations, and PVsyst yield forecasting.

TECHNICAL SKILLS:
• PVsyst, AutoCAD Electrical, ETAP, MATLAB/Simulink, MS Excel
• Solar PV Layouts, String Sizing, Transformer & Switchgear Sizing, 33kV Evacuation Lines
• CEA Regulations, IEC Standards, Earthing Calculations (IEEE 80), Lightning Protection (IEC 62305)
• Bill of Materials (BOM), Vendor Document Review, Field Inspection

WORK EXPERIENCE:
Senior Electrical Engineer | Vikram Solar (2021 – Present)
• Designed electrical systems for 45MW of commercial and captive ground-mount solar installations.
• Executed PVsyst simulation runs, shadow analysis, and degradation modeling.
• Prepared engineering deliverables: Single-Line Diagrams (SLD), general layout drawings, inverter duty transformer specifications.
• Handled technical vendor queries during procurement for cables, inverters, and switchgear panels.

Electrical Design Engineer | Enerparc India (2019 – 2021)
• Generated AutoCAD schematics for rooftop and ground-mount PV plants.
• Calculated DC and AC voltage drop, short circuit levels, and cable sizing according to IS/IEC standards.
• Participated in site verification and commissioning audits.

EDUCATION:
• M.Tech in Power Systems, NIT Trichy (2019)
• B.Tech in Electrical & Electronics Engineering, Anna University (2017)`
  },
  {
    id: 'cand-3',
    name: 'Amit Kulkarni',
    fileName: 'Amit_Kulkarni_Solar_Engineer.docx',
    source: 'sample',
    content: `AMIT KULKARNI
Solar Rooftop Project Engineer | 3.5 Years Experience
Pune, Maharashtra | amit.kulkarni@example.com

PROFESSIONAL SUMMARY:
Project Engineer with 3.5 years of experience in distributed rooftop solar PV installations (10kW to 500kW). Skilled in site survey, structural verification, AutoCAD drafting, and net-metering liaisoning with MSEDCL.

EXPERIENCE:
Project Engineer | CleanMax Enviro Energy Solutions (2022 – Present)
• Conducted shadow analysis and initial site surveys for 30+ industrial rooftop solar projects.
• Created 2D layout drawings in AutoCAD and prepared bill of quantities (BOQ).
• Coordinated with DISCOM local sub-stations for net metering sanctions and meter testing.
• Assisted senior engineers in preliminary PVsyst energy estimates.

Junior Site Engineer | SunSource Energy (2020 – 2022)
• Supervised module mounting structure (MMS) assembly and inverter installations on site.
• Monitored DC string wiring, inverter earthing, and AC distribution boards.

SKILLS:
• AutoCAD 2D, Basic PVsyst, SketchUp, Site Surveying, MSEDCL Net Metering
• Inverter Commissioning (Sungrow, Growatt, Delta)
• AC/DC Cable Laying and Earthing

EDUCATION:
• B.E. in Electrical Engineering, Pune University (2020)`
  },
  {
    id: 'cand-4',
    name: 'Sneha Patel',
    fileName: 'Sneha_Patel_Renewable_Graduate.pdf',
    source: 'sample',
    content: `SNEHA PATEL
Junior Renewable Energy Analyst
Ahmedabad, Gujarat | sneha.patel.res@example.com

OBJECTIVE:
Enthusiastic and analytical Renewable Energy Master's graduate eager to apply academic research in photovoltaic simulation, clean tech modeling, and solar resource analysis to utility-scale EPC engineering.

ACADEMIC QUALIFICATIONS:
• Master of Science in Renewable Energy Technologies, PDPU Gandhinagar (2023) - CGPA 8.8/10
• Bachelor of Technology in Mechanical Engineering, Nirma University (2021)

KEY RESEARCH PROJECTS:
• Comparative Performance Analysis of Bifacial vs Monofacial Solar Modules under Indian Climatic Conditions (Master's Thesis using PVsyst & SAM).
• Microgrid Simulation using HOMER Pro and MATLAB for decentralized off-grid solar storage.

TECHNICAL SKILLS:
• PVsyst (Academic projects), System Advisor Model (SAM), HOMER Pro, Python (Data Analysis), Basic AutoCAD
• Understanding of solar radiation geometry, tilt angle optimization, and PV cell temperature coefficients.
• Fast learner with strong presentation and research documentation skills.`
  },
  {
    id: 'cand-5',
    name: 'Vikram Malhotra',
    fileName: 'Vikram_Malhotra_Software_Resume.pdf',
    source: 'sample',
    content: `VIKRAM MALHOTRA
Senior Frontend React Developer
Bengaluru | vikram.dev@example.com

PROFESSIONAL SUMMARY:
Web Developer with 5 years experience specializing in modern JavaScript, React.js, Tailwind CSS, Next.js, and Redux. Passionate about building responsive UI applications, component libraries, and client dashboards.

TECHNICAL SKILLS:
• React, Next.js, TypeScript, JavaScript (ES6+), HTML5, CSS3, Tailwind CSS
• State Management: Redux Toolkit, Zustand
• REST APIs, GraphQL, Jest, Webpack, Git, CI/CD pipelines

EXPERIENCE:
Senior Frontend Developer | SaaS Solutions India (2021 – Present)
• Built customer billing portal in React and TypeScript.
• Reduced web application bundle size by 35% through code splitting.
• Mentored 3 junior frontend developers in responsive CSS and state architecture.

EDUCATION:
• B.Tech in Computer Science Engineering, VIT Vellore (2019)`
  }
];
