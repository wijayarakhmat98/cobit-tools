import {
	mst_df1,
}
from 'master';

function chart_visual(view, x) {
	view.innerHTML = '';
	view.style['width'] = 'fit-content';
	view.style['margin-right'] = 'auto';
	view.style['margin-left'] = 'auto';
	view.style['display'] = 'grid';
	view.style['grid-template-columns'] = 'auto repeat(5, 8rem) auto';
	for (let i = 0; i < mst_df1.length; ++i) {
		let name = document.createElement('div');
		name.innerText = mst_df1[i]['dimension'];
		name.style['grid-column-start'] = 1;
		name.style['grid-column-end'] = 2;
		name.style['white-space'] = 'nowrap';
		name.style['padding-right'] = '1rem';
		name.style['padding-left'] = '0.5rem';
		name.style['padding-bottom'] = '0.5rem';
		name.style['border-right'] = 'solid black 1px';
		view.append(name);
		let im = document.createElement('div');
		im.innerText = x[i][0];
		im.style['background-color'] = 'lightgray';
		im.style['grid-column-start'] = 2;
		im.style['grid-column-end'] = 2 + 1.0 * x[i][0];
		im.style['margin-bottom'] = '0.5rem';
		im.style['padding-left'] = '0.5rem';
		view.append(im);
		let line = document.createElement('div');
		line.style['grid-column-start'] = 8;
		line.style['grid-column-end'] = 9;
		line.style['border-left'] = 'solid black 1px';
		view.append(line);
	}
}

export default chart_visual;
