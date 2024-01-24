function matrix_create(row, col, fill = 0.0) {
	let r = [];
	for (let j = 0; j < col; ++j)
		r.push(fill);
	let A = [];
	for (let i = 0; i < row; ++i)
		A.push(structuredClone(r));
	return A;
}

function matrix_row(A) {
	return A.length;
}

function matrix_col(A) {
	return A[0].length;
}

function matrix_sum_element(A) {
	let s = 0.0;
	for (let i = 0; i < matrix_row(A); ++i)
		for (let j = 0; j < matrix_col(A); ++j)
			s += A[i][j];
	return s;
}

function matrix_flatten(A) {
	let a = [];
	for (let i = 0; i < matrix_row(A); ++i)
		for (let j = 0; j < matrix_col(A); ++j)
			a.push(A[i][j]);
	return a;
}

function matrix_reciprocal(A) {
	const row = matrix_row(A);
	const col = matrix_col(A);
	let B = matrix_create(row, col);
	for (let i = 0; i < row; ++i)
		for (let j = 0; j < col; ++j)
			B[i][j] = 1.0 / A[i][j];
	return B;
}

function matrix_transpose(A) {
	const row = matrix_col(A);
	const col = matrix_row(A);
	let B = matrix_create(row, col);
	for (let i = 0; i < row; ++i)
		for (let j = 0; j < col; ++j)
			B[i][j] = A[j][i];
	return B;
}

function matrix_scalar_multiply(c, A) {
	const row = matrix_row(A);
	const col = matrix_col(A);
	let B = matrix_create(row, col);
	for (let i = 0; i < row; ++i)
		for (let j = 0; j < col; ++j)
			B[i][j] = c * A[i][j];
	return B;
}

function matrix_multiply(A, B) {
	const row = matrix_row(A);
	const col = matrix_col(B);
	const spr = matrix_row(B);
	let C = matrix_create(row, col);
	for (let i = 0; i < row; ++i)
		for (let j = 0; j < col; ++j)
			for (let k = 0; k < spr; ++k)
				C[i][j] += A[i][k] * B[k][j];
	return C;
}

function matrix_element_multiply(A, B) {
	const row = matrix_row(A);
	const col = matrix_col(A);
	let C = matrix_create(row, col);
	for (let i = 0; i < row; ++i)
		for (let j = 0; j < col; ++j)
			C[i][j] = A[i][j] * B[i][j];
	return C;
}

function matrix_element_map(A, callback) {
	const row = matrix_row(A);
	const col = matrix_col(A);
	let B = matrix_create(row, col);
	for (let i = 0; i < row; ++i)
		for (let j = 0; j < col; ++j)
			B[i][j] = callback(A[i][j], i, j);
	return B;
}

export {
	matrix_create,
	matrix_row,
	matrix_col,
	matrix_sum_element,
	matrix_flatten,
	matrix_reciprocal,
	matrix_transpose,
	matrix_scalar_multiply,
	matrix_multiply,
	matrix_element_multiply,
	matrix_element_map
};
