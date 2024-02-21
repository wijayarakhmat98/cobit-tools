class visual extends HTMLElement {
	static state_view({} = {}) {
		return {};
	}

	constructor({} = {}) {
		super();
	}

	restore({state} = {}) {
		this.state = state;
	}

	capture({} = {}) {
		return this.state;
	}

	state_view({} = {}) {
		if (!this.state)
			this.state = visual.state_view();
	}

	view({mst_df, x} = {}) {
		this.state_view();
		this.innerHTML = '';
		this.style['width'] = 'fit-content';
		this.style['margin-right'] = 'auto';
		this.style['margin-left'] = 'auto';
		this.style['display'] = 'grid';
		this.style['grid-template-columns'] = 'auto repeat(5, 8rem) auto';
		for (let i = 0; i < mst_df.length; ++i) {
			let name = document.createElement('div');
			name.innerText = mst_df[i]['dimension'];
			name.style['grid-column-start'] = 1;
			name.style['grid-column-end'] = 2;
			name.style['white-space'] = 'nowrap';
			name.style['padding-right'] = '1rem';
			name.style['padding-left'] = '0.5rem';
			name.style['padding-bottom'] = '0.5rem';
			name.style['border-right'] = 'solid black 1px';
			this.append(name);
			let im = document.createElement('div');
			im.innerText = x[i][0];
			im.style['background-color'] = 'lightgray';
			im.style['grid-column-start'] = 2;
			im.style['grid-column-end'] = 2 + 1.0 * x[i][0];
			im.style['margin-bottom'] = '0.5rem';
			im.style['padding-left'] = '0.5rem';
			this.append(im);
			let line = document.createElement('div');
			line.style['grid-column-start'] = 8;
			line.style['grid-column-end'] = 9;
			line.style['border-left'] = 'solid black 1px';
			this.append(line);
		}
	}
}

export default visual;
