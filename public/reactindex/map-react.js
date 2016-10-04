//-------------------------------------------------------------------


var TodoList = React.createClass({
    render: function() {
        var createItem = function(item) {
            return <li key={item.id}>{item.text}</li>;
        };
        return <ul>{this.props.items.map(createItem)}</ul>;
    }
});
// var itemsHash = {};
// var idxCount = 0;
var TodoApp = React.createClass({
    getInitialState: function() {
        return {items: [], text: ''};
    },
    onChange: function(e) {
        this.setState({text: e.target.value});
    },
    handleAdd: function() {
        // e.preventDefault(); // This is, by default, submit button by form. Make sure it isn't submitted.
        var nextItems = this.state.items.concat([{text: this.state.text, id: Date.now()}]);
        // itemsHash[count] = this.state.text;
        var nextText = '';
        this.setState({items: nextItems, text: nextText});
        addUpdateMarker(this.state.text);
    },
    handleAddHelper: function(){
        return this.handleAdd();
    },
    updateInput: function(text) {
        this.setState({items: this.state.items, text: text});
    },
    handleDelete: function() {
        var deleteItem = deleteMarker();
        console.log(deleteItem);
        delete this.state.items[deleteItem];
    },
    submission: function(e) {
        this.handleAdd(e);
        e.preventDefault();
    },
    render: function() {
        return (
            <div>
            <h3>Foodshares</h3>
            <TodoList items={this.state.items} />
        <form onSubmit={this.submission}>
        <input onChange={this.onChange} value={this.state.text} />
        <button type="button" onClick={this.handleAdd}>{'Add #' + (this.state.items.length + 1)}</button>
            <button type="button" onClick={this.handleDelete}>{"Delete"}</button>
        </form>
        </div>
        );
    }
});

var foodList = ReactDOM.render(<TodoApp />, document.getElementById('container'));

getFoodList(foodList);