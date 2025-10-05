import './stats.scss'
import Paper from '../../../../components/paper/paper'

const Stats = () => {
    return (
        <Paper id='stats'>
            <h2>Stats</h2>
            <div className='stat'>
                <span>HP</span>
                <div className='stat-bar' style={{ backgroundColor: 'red' }}>
                    <span>100 / 100</span>
                </div>
            </div>
            <div className='stat'>
                <span>Energy</span>
                <div className='stat-bar' style={{ backgroundColor: 'cyan' }}>
                    <span>100 / 100</span>
                </div>
            </div>
        </Paper>
    )
}

export default Stats
