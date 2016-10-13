import React from 'react'
import ReactDOM from 'react-dom'
import {Button, Input} from 'react-materialize'
//credit to Professor Bell from GMU's SWE-432

var FoodListItems = React.createClass({
    render: function() {
        var createItem = function(item) {
            return <li key={item.id}>{item.text}</li>;
        };
        return <ul>{this.props.items.map(createItem)}</ul>;
    }
});
// var itemsHash = {};
// var idxCount = 0;
var FoodListApp = React.createClass({
    getInitialState: function() {
        return {items: [], text: '', tag: ''};
    },
    onChange: function(e) {
        this.setState({text: e.target.value});
    },
    onTagChange: function(e) {
        this.setState({tag: e.target.value});
    },
    handleAdd: function() {
        // e.preventDefault(); // This is, by default, submit button by form. Make sure it isn't submitted.
        var nextItems = this.state.items.concat([{text: this.state.text, id: Date.now()}]);
        // itemsHash[count] = this.state.text;
        var nextText = '';
        this.setState({items: nextItems, text: nextText});
        addUpdateMarker(this.state.text, this.state.tag);
    },
    handleAddHelper: function(){
        return this.handleAdd();
    },
    updateInput: function(text, tag) {
        this.setState({items: this.state.items, text: text, tag: tag});
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
            <FoodListItems items={this.state.items} />
        <form onSubmit={this.submission}>
        <Input className="col s6" placeholder="Enter food info" type="text" onChange={this.onChange} value={this.state.text} />
        <Input className="col s6" placeholder="Enter tag" type="text" onChange={this.onTagChange} value={this.state.tag} />

        <Button type="button" onClick={this.handleAdd}>Add</Button>
            <Button type="button" onClick={this.handleDelete}>{"Delete"}</Button>
        </form>
        </div>
        );
    }
});

var foodList = ReactDOM.render(<FoodListApp />, document.getElementById('list-container'));

getFoodList(foodList);