import '../../style.css';
import ReactHtmlParser from 'react-html-parser';

class Sop extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            url: props.url,
            name: props.name
        };
    }

    render() {
        let url = this.state.url;
        let link = '';
        if (typeof url != 'undefined') {
            link = '<a href="' + url + '" target=_blank>' + this.state.name + '</a>';
        }
        return (
            <div className={'sop'}>
                { ReactHtmlParser (link) }
           </div>
        )
    }
}

export default Sop;