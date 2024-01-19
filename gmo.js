function toggle_details(button, details) {
	let x = document.getElementById(details);
	let y = document.getElementById(button);
	if (x.style['display'] == 'none') {
		x.style['display'] = '';
		y.innerText = '_';
	} else {
		x.style['display'] = 'none';
		y.innerText = '>';
	}
}

function matrix_multiply(A, B) {
	const A_row = A.length;
	const A_col = A[0].length;
	const B_row = B.length;
	const B_col = B[0].length;
	let C = [];
	for (let i = 0; i < A_row; ++i) {
		C.push([]);
		for (let j = 0; j < B_col; ++j) {
			C[i].push(0.0);
		}
	}
	for (let i = 0; i < A_row; ++i)
		for (let j = 0; j < B_col; ++j)
			for (let k = 0; k < A_col; ++k)
				C[i][j] += A[i][k] * B[k][j];
	return C;
}

const mst_gmo = [
    {
        "dimension": "Ensured governance framework setting and maintenance",
        "code": "EDM01",
        "explanation": "Provide a consistent approach, integrated and aligned with the enterprise governance approach. I&T-related decisions must be made in line with the enterprise’s strategies and objectives and desired value is realized. To that end, ensure that I&T-related processes are overseen effectively and transparently; compliance with legal, contractual and regulatory requirements is confirmed; and the governance requirements for board members are met."
    },
    {
        "dimension": "Ensured benefits delivery",
        "code": "EDM02",
        "explanation": "Secure optimal value from I&T-enabled initiatives, services and assets; cost-effective delivery of solutions and services; and a reliable and accurate picture of costs and likely benefits so that business needs are supported effectively and efficiently."
    },
    {
        "dimension": "Ensured risk optimization",
        "code": "EDM03",
        "explanation": "Ensure that I&T-related enterprise risk does not exceed the enterprise’s risk appetite and risk tolerance, the impact of I&T risk to enterprise value is identified and managed, and the potential for compliance failures is minimized."
    },
    {
        "dimension": "Ensured resource optimization",
        "code": "EDM04",
        "explanation": "Ensure that the resource needs of the enterprise are met in the optimal manner, I&T costs are optimized, and there is an increased likelihood of benefit realization and readiness for future change."
    },
    {
        "dimension": "Ensured stakeholder engagement",
        "code": "EDM05",
        "explanation": "Ensure that stakeholders are supportive of the I&T strategy and road map, communication to stakeholders is effective and timely, and the basis for reporting is established to increase performance. Identify areas for improvement, and confirm that I&T-related objectives and strategies are in line with the enterprise’s strategy."
    },
    {
        "dimension": "Managed I&T management framework",
        "code": "APO01",
        "explanation": "Implement a consistent management approach for enterprise governance requirements to be met, covering governance components such as management processes; organizational structures; roles and responsibilities; reliable and repeatable activities; information items; policies and procedures; skills and competencies; culture and behavior; and services, infrastructure and applications."
    },
    {
        "dimension": "Managed strategy",
        "code": "APO02",
        "explanation": "Support the digital transformation strategy of the organization and deliver the desired value through a road map of incremental changes. Use a holistic I&T approach, ensuring that each initiative is clearly connected to an overarching strategy. Enable change in all different aspects of the organization, from channels and processes to data, culture, skills, operating model and incentives."
    },
    {
        "dimension": "Managed enterprise architecture",
        "code": "APO03",
        "explanation": "Represent the different building blocks that make up the enterprise and its interrelationships, as well as the principles guiding their design and evolution over time, to enable a standard, responsive and efficient delivery of operational and strategic objectives."
    },
    {
        "dimension": "Managed innovation",
        "code": "APO04",
        "explanation": "Achieve competitive advantage, business innovation, improved customer experience, and improved operational effectiveness and efficiency by exploiting I&T developments and emerging technologies."
    },
    {
        "dimension": "Managed portfolio",
        "code": "APO05",
        "explanation": "Optimize the performance of the overall portfolio of programs in response to individual program, product and service performance and changing enterprise priorities and demand."
    },
    {
        "dimension": "Managed budget and costs",
        "code": "APO06",
        "explanation": "Foster a partnership between IT and enterprise stakeholders to enable the effective and efficient use of I&T-related resources and provide transparency and accountability of the cost and business value of solutions and services. Enable the enterprise to make informed decisions regarding the use of I&T solutions and services."
    },
    {
        "dimension": "Managed human resources",
        "code": "APO07",
        "explanation": "Optimize human-resources capabilities to meet enterprise objectives."
    },
    {
        "dimension": "Managed relationships",
        "code": "APO08",
        "explanation": "Enable the right knowledge, skills and behaviors to create improved outcomes, increased confidence, mutual trust and effective use of resources that stimulate a productive relationship with business stakeholders."
    },
    {
        "dimension": "Managed service agreements",
        "code": "APO09",
        "explanation": "Ensure that I&T products, services and service levels meet current and future enterprise needs."
    },
    {
        "dimension": "Managed vendors",
        "code": "APO10",
        "explanation": "Optimize available I&T capabilities to support the I&T strategy and road map, minimize the risk associated with nonperforming or noncompliant vendors, and ensure competitive pricing."
    },
    {
        "dimension": "Managed quality",
        "code": "APO11",
        "explanation": "Ensure consistent delivery of technology solutions and services to meet the quality requirements of the enterprise and satisfy stakeholder needs."
    },
    {
        "dimension": "Managed risk",
        "code": "APO12",
        "explanation": "Integrate the management of I&T-related enterprise risk with overall enterprise risk management (ERM) and balance the costs and benefits of managing I&T-related enterprise risk."
    },
    {
        "dimension": "Managed security",
        "code": "APO13",
        "explanation": "Keep the impact and occurrence of information security incidents within the enterprise’s risk appetite levels."
    },
    {
        "dimension": "Managed data",
        "code": "APO14",
        "explanation": "Ensure effective utilization of the critical data assets to achieve enterprise goals and objectives."
    },
    {
        "dimension": "Managed programs",
        "code": "BAI01",
        "explanation": "Realize desired business value and reduce the risk of unexpected delays, costs and value erosion. To do so, improve communications to and involvement of business and end users, ensure the value and quality of program deliverables and follow-up of projects within the programs, and maximize program contribution to the investment portfolio."
    },
    {
        "dimension": "Managed requirements definition",
        "code": "BAI02",
        "explanation": "Create optimal solutions that meet enterprise needs while minimizing risk."
    },
    {
        "dimension": "Managed solutions identification and build",
        "code": "BAI03",
        "explanation": "Ensure agile and scalable delivery of digital products and services. Establish timely and cost-effective solutions (technology, business processes and workflows) capable of supporting enterprise strategic and operational objectives."
    },
    {
        "dimension": "Managed availability and capacity",
        "code": "BAI04",
        "explanation": "Maintain service availability, efficient management of resources and optimization of system performance through prediction of future performance and capacity requirements."
    },
    {
        "dimension": "Managed organizational change",
        "code": "BAI05",
        "explanation": "Prepare and commit stakeholders for business change and reduce the risk of failure."
    },
    {
        "dimension": "Managed IT changes",
        "code": "BAI06",
        "explanation": "Enable fast and reliable delivery of change to the business. Mitigate the risk of negatively impacting the stability or integrity of the changed environment."
    },
    {
        "dimension": "Managed IT change acceptance and transitioning",
        "code": "BAI07",
        "explanation": "Implement solutions safely and in line with the agreed expectations and outcomes."
    },
    {
        "dimension": "Managed knowledge",
        "code": "BAI08",
        "explanation": "Provide the knowledge and management information required to support all staff in the governance and management of enterprise I&T and allow for informed decision making."
    },
    {
        "dimension": "Managed assets",
        "code": "BAI09",
        "explanation": "Account for all I&T assets and optimize the value provided by their use."
    },
    {
        "dimension": "Managed configuration",
        "code": "BAI10",
        "explanation": "Provide sufficient information about service assets to enable the service to be effectively managed. Assess the impact of changes and deal with service incidents."
    },
    {
        "dimension": "Managed projects",
        "code": "BAI11",
        "explanation": "Realize defined project outcomes and reduce the risk of unexpected delays, costs and value erosion by improving communications to and involvement of business and end users. Ensure the value and quality of project deliverables and maximize their contribution to the defined programs and investment portfolio."
    },
    {
        "dimension": "Managed operations",
        "code": "DSS01",
        "explanation": "Deliver I&T operational product and service outcomes as planned."
    },
    {
        "dimension": "Managed service requests and incidents",
        "code": "DSS02",
        "explanation": "Achieve increased productivity and minimize disruptions through quick resolution of user queries and incidents. Assess the impact of changes and deal with service incidents. Resolve user requests and restore service in response to incidents."
    },
    {
        "dimension": "Managed problems",
        "code": "DSS03",
        "explanation": "Increase availability, improve service levels, reduce costs, improve customer convenience and satisfaction by reducing the number of operational problems, and identify root causes as part of problem resolution."
    },
    {
        "dimension": "Managed continuity",
        "code": "DSS04",
        "explanation": "Adapt rapidly, continue business operations, and maintain availability of resources and information at a level acceptable to the enterprise in the event of a significant disruption (e.g., threats, opportunities, demands)."
    },
    {
        "dimension": "Managed security services",
        "code": "DSS05",
        "explanation": "Minimize the business impact of operational information security vulnerabilities and incidents."
    },
    {
        "dimension": "Managed business process controls",
        "code": "DSS06",
        "explanation": "Maintain information integrity and the security of information assets handled within business processes in the enterprise or its outsourced operation."
    },
    {
        "dimension": "Managed performance and conformance monitoring",
        "code": "MEA01",
        "explanation": "Provide transparency of performance and conformance and drive achievement of goals."
    },
    {
        "dimension": "Managed system of internal control",
        "code": "MEA02",
        "explanation": "Obtain transparency for key stakeholders on the adequacy of the system of internal controls and thus provide trust in operations, confidence in the achievement of enterprise objectives and an adequate understanding of residual risk."
    },
    {
        "dimension": "Managed compliance with external requirements",
        "code": "MEA03",
        "explanation": "Ensure that the enterprise is compliant with all applicable external requirements."
    },
    {
        "dimension": "Managed assurance",
        "code": "MEA04",
        "explanation": "Enable the organization to design and develop efficient and effective assurance initiatives, providing guidance on planning, scoping, executing and following up on assurance reviews, using a road map based on well-accepted assurance approaches."
    }
];

const trs_df1_map = [
	[1.0, 1.0, 1.5, 1.5], [1.5, 1.0, 2.0, 3.5], [1.0, 1.0, 1.0, 2.0],
	[1.5, 1.0, 4.0, 1.0], [1.5, 1.5, 1.0, 2.0], [1.0, 1.0, 1.0, 1.0],
	[3.5, 3.5, 1.5, 1.0], [4.0, 2.0, 1.0, 1.0], [1.0, 4.0, 1.0, 1.0],
	[3.5, 4.0, 2.5, 1.0], [1.5, 1.0, 4.0, 1.0], [2.0, 1.0, 1.0, 1.0],
	[1.0, 1.5, 1.0, 3.5], [1.0, 1.0, 1.5, 4.0], [1.0, 1.0, 3.5, 1.5],
	[1.0, 1.0, 1.0, 4.0], [1.0, 1.5, 1.0, 2.5], [1.0, 1.0, 1.0, 2.5],
	[1.0, 1.0, 1.0, 1.0], [4.0, 2.0, 1.5, 1.5], [1.0, 1.0, 1.5, 1.0],
	[1.0, 1.0, 1.5, 1.0], [1.0, 1.0, 1.0, 3.0], [4.0, 2.0, 1.0, 1.5],
	[2.0, 2.0, 1.0, 1.5], [1.5, 2.0, 1.0, 1.5], [1.0, 3.5, 1.0, 1.0],
	[1.0, 1.0, 1.0, 1.0], [1.0, 1.0, 1.0, 1.0], [3.5, 3.0, 1.5, 1.0],
	[1.0, 1.0, 1.0, 1.5], [1.0, 1.0, 1.0, 4.0], [1.0, 1.0, 1.0, 3.0],
	[1.0, 1.0, 1.0, 4.0], [1.0, 1.0, 1.0, 2.5], [1.0, 1.0, 1.0, 1.5],
	[1.0, 1.0, 1.0, 1.0], [1.0, 1.0, 1.0, 1.0], [1.0, 1.0, 1.0, 1.0],
	[1.0, 1.0, 1.0, 1.0]
];

function chart_gmo(view, snapshot) {
	const x = mst_df1.map((d) => {
		const v = document.querySelector(`input[name="df1 ${d.id} value"]:checked`).value;
		if (v == 'old' || v < 0)
			return [snapshot[v][d.id - 1].value];
		return [v];
	});
	const x_base = trs_df1_baseline.map((d) => [d.value]);
	r_hat = calculate_gmo(x, x_base);
	draw_gmo(view, r_hat);
}

function calculate_gmo(x, x_base) {
	const one4 = [[1, 1, 1, 1]];
	const one40 = [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]];
	const c = matrix_multiply(one4, x_base)[0][0] / matrix_multiply(one4, x)[0][0];
	const y = matrix_multiply(trs_df1_map, x);
	const y_base = matrix_multiply(trs_df1_map, x_base);
	const r = ((c, y, y_base) => {
		let r = [];
		for (let i = 0; i < y.length; ++i)
			r.push([c * y[i][0] / y_base[i][0]]);
		return r;
	})(c, y, y_base);
	const r_hat = ((r) => {
		let r_hat = [];
		for (let i = 0; i < r.length; ++i)
			r_hat.push([Math.round(20 * r[i][0]) * 5 - 100]);
		return r_hat;
	})(r);
	return r_hat;
}

function draw_gmo(view, r_hat) {
	view.innerHTML = '';
	view.style['width'] = 'fit-content';
	view.style['margin-right'] = 'auto';
	view.style['margin-left'] = 'auto';
	view.style['display'] = 'grid';
	view.style['grid-template-columns'] = 'auto auto auto repeat(200, 0.2rem)';
	const offset = 3;
	for (let i = 0; i < mst_gmo.length; ++i) {
		let button = document.createElement('button');
		button.id = 'button gmo' + (i + 1);
		button.type = 'button';
		button.innerText = '>';
		button.style['grid-column-start'] = 1;
		button.style['grid-column-end'] = 2;
		button.onclick = () => { toggle_details('button gmo' + (i + 1), 'details gmo' + (i + 1)); }
		view.append(button);
		let code = document.createElement('div');
		code.innerText = mst_gmo[i]['code'];
		code.style['grid-column-start'] = 2;
		code.style['grid-column-end'] = 3;
		code.style['white-space'] = 'nowrap';
		code.style['padding-right'] = '0.5rem';
		code.style['padding-left'] = '1rem';
		view.append(code);
		let name = document.createElement('div');
		name.innerText = mst_gmo[i]['dimension'];
		name.style['grid-column-start'] = 3;
		name.style['grid-column-end'] = 4;
		name.style['white-space'] = 'nowrap';
		name.style['padding-right'] = '1rem';
		name.style['padding-left'] = '0.5rem';
		name.style['border-right'] = 'solid black 1px';
		view.append(name);
		let bar = document.createElement('div');
		bar.innerText = r_hat[i][0];
		if (r_hat[i][0] > 0) {
			bar.style['background-color'] = 'lightblue';
			bar.style['grid-column-start'] = 100 + offset;
			bar.style['grid-column-end'] = 100 + offset + r_hat[i][0];
			bar.style['text-align'] = 'left';
		} else if (r_hat[i][0] < 0) {
			bar.style['background-color'] = 'lightblue';
			bar.style['grid-column-start'] = 100 + offset + r_hat[i][0];
			bar.style['grid-column-end'] =  100 + offset;
			bar.style['text-align'] = 'right';
		} else {
			bar.style['grid-column-start'] = offset + 1;
			bar.style['grid-column-end'] =  200 + offset + 1;
			bar.style['text-align'] = 'center';
		}
		view.append(bar);
		let details = document.createElement('p');
		details.id = 'details gmo' + (i + 1);
		details.innerHTML = mst_gmo[i]['explanation'];
		details.style['grid-column-start'] = 2;
		details.style['grid-column-end'] = 200 + offset + 1;
		details.style['margin-right'] = '1rem';
		details.style['margin-left'] = '1rem';
		details.style['display'] = 'none';
		view.append(details);
	}
}
