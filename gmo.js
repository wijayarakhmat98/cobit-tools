import {
	mst_gmo,
	mst_df1,
	trs_df1_baseline,
	trs_df1_map_matrix
}
from 'master';

import {
	matrix_sum_element,
	matrix_reciprocal,
	matrix_scalar_multiply,
	matrix_multiply,
	matrix_element_multiply,
	matrix_element_map
}
from 'matrix';

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

function chart_gmo(view, snapshot) {
	const x = mst_df1.map(d => {
		const v = document.querySelector(`input[name="df1 ${d.id} value"]:checked`).value;
		return [JSON.parse(v)['value']];
	});
	const x_base = trs_df1_baseline.map((d) => [d.value]);
	const r_hat = calculate_gmo(x, x_base);
	draw_gmo(view, r_hat);
}

function calculate_gmo(x, x_base) {
	const c = matrix_sum_element(x_base) / matrix_sum_element(x);
	const y = matrix_multiply(trs_df1_map_matrix, x);
	const y_base = matrix_multiply(trs_df1_map_matrix, x_base);
	const r = matrix_scalar_multiply(c, matrix_element_multiply(y, matrix_reciprocal(y_base)));
	const r_hat = matrix_element_map(r, e => Math.round(20 * e) * 5 - 100);
	return r_hat;
}

function draw_gmo(view, r_hat) {
	view.innerHTML = '';
	view.style['margin-right'] = 'auto';
	view.style['margin-left'] = 'auto';
	view.style['display'] = 'inline-grid';
	view.style['grid-template-columns'] = 'auto auto auto repeat(200, 0.2rem) auto';
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
		let line = document.createElement('div');
		line.style['grid-column-start'] = 200 + offset + 1;
		line.style['grid-column-end'] = 200 + offset + 2;
		line.style['border-left'] = 'solid black 1px';
		view.append(line);
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

export default chart_gmo;
