interface CircleIconProps {
    color: string;

}
const CircleIcon = ({ color }: CircleIconProps) => {
    return <svg className={'fill-current ' + color} height='12' width='12'>
        <circle cx='5' cy='5' r='4' />
    </svg>
};

export default CircleIcon;
