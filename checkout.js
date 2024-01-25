import chart_control from 'control';
import chart_graph from 'graph';
import chart_sheet from 'sheet';
import chart_gmo from 'gmo';

function checkout(history, commit, view_control, view_graph, view_sheet, view_gmo) {
	chart_graph(view_graph, history);
	chart_sheet(view_sheet, commit, () => chart_gmo(view_gmo));
	chart_gmo(view_gmo);
	chart_control(view_control, view_graph, commit);
}

export default checkout;
