import { BarChart, Bar, XAxis, YAxis } from 'recharts';
const React = require('react');


class GraphComponent extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      data: [],
    }


    // Binds

  }

  fetchData() {

    fetch(this.props.URL + '/templateStats?id=' + this.props.currentTemplate.id)
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.setState({
          data: data,
        })

      }).catch(error => {
        console.log(error);
        // finish fetchnig
      });
  }

  componentDidMount() {
    this.setState({
      data: [
        { category: 'viewed', popularity: 0 },
        { category: 'used', popularity: 0 },
      ]
    })
  }
  x
  componentDidUpdate(prevProps, prevState) {
    //console.log(this.props.currentTemplate);
    if (this.props.currentTemplate !== prevProps.currentTemplate) {
      try {
        if (this.props.currentTemplate.statistics != undefined) {
          var used = this.props.currentTemplate.statistics.used || 0
          this.setState({
            data: [
              { category: 'viewed', popularity: 2 },
              { category: 'used', popularity: used },
            ]
          })
        }
      } catch (e) {
        console.log(e)
      }
    }
  }




  render() {
    return (
      <div className="graph-view">
        <BarChart width={320} height={200} data={this.state.data} className="chart">
          <XAxis dataKey="category" stroke='#ffffff' fontSize="12px" allowDataOverflow={"true"} />
          <YAxis dataKey="popularity" stroke='#ffffff' />
          <Bar dataKey="popularity" fill='#ffffff' />
        </BarChart>
      </div>
    )
  }
}

export default GraphComponent;