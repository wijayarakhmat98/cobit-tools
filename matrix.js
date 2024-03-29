function matrix_create({row, col, fill = 0.0} = {}) {
	const r = [];
	for (let j = 0; j < col; ++j)
		r.push(fill);
	const A = [];
	for (let i = 0; i < row; ++i)
		A.push(structuredClone(r));
	return A;
}

function matrix_row({A} = {}) {
	return A.length;
}

function matrix_col({A} = {}) {
	return A[0].length;
}

function matrix_sum_element({A} = {}) {
	let s = 0.0;
	for (let i = 0; i < matrix_row({A: A}); ++i)
		for (let j = 0; j < matrix_col({A: A}); ++j)
			s += A[i][j];
	return s;
}

function matrix_flatten({A} = {}) {
	const a = [];
	for (let i = 0; i < matrix_row({A: A}); ++i)
		for (let j = 0; j < matrix_col({A: A}); ++j)
			a.push(A[i][j]);
	return a;
}

function matrix_reciprocal({A} = {}) {
	const row = matrix_row({A: A});
	const col = matrix_col({A: A});
	const B = matrix_create({row: row, col: col});
	for (let i = 0; i < row; ++i)
		for (let j = 0; j < col; ++j)
			B[i][j] = 1.0 / A[i][j];
	return B;
}

function matrix_transpose({A} = {}) {
	const row = matrix_col({A: A});
	const col = matrix_row({A: A});
	const B = matrix_create({row: row, col: col});
	for (let i = 0; i < row; ++i)
		for (let j = 0; j < col; ++j)
			B[i][j] = A[j][i];
	return B;
}

function matrix_scalar_multiply({c, A} = {}) {
	const row = matrix_row({A: A});
	const col = matrix_col({A: A});
	const B = matrix_create({row: row, col: col});
	for (let i = 0; i < row; ++i)
		for (let j = 0; j < col; ++j)
			B[i][j] = c * A[i][j];
	return B;
}

function matrix_multiply({A, B} = {}) {
	const row = matrix_row({A: A});
	const col = matrix_col({A: B});
	const spr = matrix_row({A: B});
	const C = matrix_create({row: row, col: col});
	for (let i = 0; i < row; ++i)
		for (let j = 0; j < col; ++j)
			for (let k = 0; k < spr; ++k)
				C[i][j] += A[i][k] * B[k][j];
	return C;
}

function matrix_element_multiply({A, B} = {}) {
	const row = matrix_row({A: A});
	const col = matrix_col({A: A});
	const C = matrix_create({row: row, col: col});
	for (let i = 0; i < row; ++i)
		for (let j = 0; j < col; ++j)
			C[i][j] = A[i][j] * B[i][j];
	return C;
}

function matrix_element_map({A, callback} = {}) {
	const row = matrix_row({A: A});
	const col = matrix_col({A: A});
	const B = matrix_create({row: row, col: col});
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
