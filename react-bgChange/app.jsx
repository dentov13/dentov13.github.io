var App = React.createClass({
  getInitialState: function() {
    return {
      bgColor: 'tomato'
    };
  },
  handleColorChange: function(color) {
    this.setState({ bgColor: color });
  },
  updateBgColor: function() {
    var body = document.querySelector('body');
    body.style.background = this.state.bgColor;
  },
  componentDidMount: function () {
    this.updateBgColor()
  },
  componentDidUpdate: function () {
    this.updateBgColor()
  },
  render: function() {
    return (
      <div className='container'>
        <h1>Change background right now !</h1>
        <h2>What color ?</h2>
        <label>
          <ColorPicker value={ this.state.bgColor }
            onColorChange={ this.handleColorChange } />
        </label>
      </div>
    );
  }
});

var ColorPicker = React.createClass({
  propTypes: {
    value: React.PropTypes.string.isRequired,
    onColorChange: React.PropTypes.func
  },
  handleChange: function(e) {
    e.preventDefault();
    var color = e.target.value;

    if(this.props.onColorChange) this.props.onColorChange(color);
  },
  render: function() {
    return (
      <select value={ this.props.value } onChange={ this.handleChange }>
        <option value='tomato'>Tomato</option>
        <option value='darkmagenta'>Dark Magenta</option>
        <option value='tan'>Tan</option>
        <option value='royalblue'>Royal Blue</option>
        <option value='salmon'>Salmon</option>
      </select>
    );
  }
});

ReactDOM.render(<App />, document.querySelector('#main'));
