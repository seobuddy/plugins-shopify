import '../../style.css';

class Status extends React.Component {
    constructor(props) {
        super(props);
        this.apiHost = props.apiHost;
        this.state = {
            state: props.state,
            selectorOpen: false,
            stepId: props.stepId,
            inCall: false,
            stateHandler: props.stateHandler,
            shortId: props.shortId
        };

        this.toggleStatusSelector = this.toggleStatusSelector.bind(this);
        this.changeStatus = this.changeStatus.bind(this);
    }

    toggleStatusSelector() {
        this.setState(state => ({
            selectorOpen: !this.state.selectorOpen
        }));
    }

    changeStatus(statusId, e) {
        fetch(
            this.apiHost + "/api/seo-checklist/step/" + this.state.stepId + "/change-status/" + statusId,
            {
                method: 'post',
                headers: new Headers({
                    'Authorization': 'Bearer ' + localStorage.getItem('seobuddyAccessToken' + this.state.shortId)
                })
            }
        )
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        inCall: false,
                        state: result.status_name
                    });
                    this.state.stateHandler(result.status_name);
                },
                (error) => {
                    this.setState({
                        inCall: false,
                        error
                    });
                    console.log('ERRRPR');
                }
            )
        this.setState(state => ({
            selectorOpen: !this.state.selectorOpen
        }));
    }

    render() {
        let className = this.state.state.toLowerCase().replace('_', '-');
        let stateName = this.state.state.charAt(0).toUpperCase() + this.state.state.slice(1).replace('_', ' ')

        return (
                <div className={'state-wrapper ' + className} onClick={this.toggleStatusSelector}>
                    <div>{stateName}</div>
                    <div className="icon">
                        <img src="https://seobuddy.com/assets/images/svg/icons/sort-arrow-down-single.svg"/>
                    </div>
                    <div className={'status-selector ' + (this.state.selectorOpen ? 'opened' : 'hidden')}>
                        <div className="title">Change status</div>
                        <div onClick={this.changeStatus.bind(this, 'becad1bf-674b-4a8e-aae9-9d8c8bf15826')} className="status not_performed">
                            Not performed
                        </div>
                        <div onClick={this.changeStatus.bind(this, '7ab231fa-602f-4bcd-aab9-9361daa70117')} className="status in_progress">
                            In progress
                        </div>
                        <div onClick={this.changeStatus.bind(this, 'c5339817-049b-43e2-8819-808f7da85aa4')} className="status done">
                            Done
                        </div>
                        <div onClick={this.changeStatus.bind(this, '511ce2b0-2686-41f0-b345-0850edc06d73')} className="status abandoned">
                            Abandoned
                        </div>
                    </div>
                </div>
        )
    }
}

export default Status;