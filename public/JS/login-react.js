/**
 * Created by Sherif on 10/4/2016.
 */
//Display that a user is logged in
var CommentList = React.createClass({
    render: function() {
        return (
            <div className="commentList">
                User name
            </div>
        );
    }
});

var CommentForm = React.createClass({
    render: function() {
        return (
            <div className="commentForm">
                {/*Hello, world! I am a CommentForm.*/}
            </div>
        );
    }
});

var CommentBox = React.createClass({
    render: function() {
        return (
            <div className="commentBox">
                <h1>Logged in</h1>
                <CommentList />
                <CommentForm />
            </div>
        );
    }
});

ReactDOM.render(
    <CommentBox />,
    document.getElementById('login')
);

var uid = getUid();