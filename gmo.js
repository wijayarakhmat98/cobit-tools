import {
	mst_gmo,
	mst_df1,
	trs_df1_baseline,
	trs_df1_map_matrix
}
from 'master';

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
	const one4 = [[1, 1, 1, 1]];
	const one40 = [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]];
	const c = matrix_multiply(one4, x_base)[0][0] / matrix_multiply(one4, x)[0][0];
	const y = matrix_multiply(trs_df1_map_matrix, x);
	const y_base = matrix_multiply(trs_df1_map_matrix, x_base);
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
