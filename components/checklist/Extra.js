import VideoIcon from "./VideoIcon";
import ArticleIcon from "./ArticleIcon";

const components = {
    article: ArticleIcon,
    video: VideoIcon
};

class Extra extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            type: props.type,
            url: props.url
        };
    }

    render() {
        let typeIcon = 'video';

        if (this.state.type === 1) {
            typeIcon = 'article';
        }

        const Icon = components[typeIcon];
        return (
            <a href={this.state.url} target="_blank" className={typeof this.state.url !== 'undefined' ? '' : 'hidden'}>
                <Icon />
            </a>
        )
    }
}

export default Extra;