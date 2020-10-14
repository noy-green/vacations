import React from 'react';
import {Bar} from 'react-chartjs-2';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@material-ui/core/Link';
import { Button } from '@material-ui/core';



export default class Reports extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      vacations:[], 
      
    }
  }

  componentDidMount() {

    (async () => {

     
      let res = await fetch(`http://localhost:1000/actions/`, {
          headers: { "Authorization": localStorage.token }
      })
      let data = await res.json()
      this.setState({vacations: data})
    
})()
} 
  render() 
 
  
  {
    console.log(this.state.vacations)
    return (
      <div>
        <Button>
        <Link to="/vacations" component={RouterLink}>Back</Link>
        </Button>
        {this.state.vacations.length==0?"blah":
       
      
        <Bar
          data={{
            labels: (this.state.vacations.filter(v=>v.followers!==0)).map(v=>v.destination),
            datasets: [
              {
                label: 'followers',
                backgroundColor: 'rgba(75,192,192,1)',
                borderColor: 'gba(0,0,0,1)',
                borderWidth: 2,
                data:  (this.state.vacations.filter(v=>v.followers!==0)).map(v=>v.followers)
              }
            ]
          }}
          options={{
            title:{
              display:true,
              text:'Number of followers per vacation',
              fontSize:20
            },
            legend:{
              display:true,
              position:'right'
            }
          }}
        />
      }
      </div>
    );
  }
}
