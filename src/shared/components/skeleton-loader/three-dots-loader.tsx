import React from 'react';
import ContentLoader from 'react-content-loader';

const CX_INITIAL = 150;
const CX_SPACE = 44;

interface ThreeDotsSmallLoaderProps {
    height?: number,
    width?: number,
    backgroundColor?: string,
    cx?: number,
    cxSpace?: number,
    cy?: number,
    r?: number,
    className?: string
}

const getCx = (cxInitial: number = CX_INITIAL, cxSpace: number = CX_SPACE, itemPosition: number): number => (
    cxInitial + (cxSpace * itemPosition)
)

const ThreeDotsSmallLoader: React.FunctionComponent<ThreeDotsSmallLoaderProps> = ({
    height,
    width,
    className,
    backgroundColor,
    cx,
    cxSpace,
    cy,
    r,
    ...props}) => (
    <ContentLoader
        className={className}
        width={width}
        height={height}
        backgroundColor={backgroundColor}
        {...props}
    >
        <circle cx={cx} cy={cy} r={r} />
        <circle cx={getCx(cx, cxSpace, 1)} cy={cy} r={r} />
        <circle cx={getCx(cx, cxSpace, 2)} cy={cy} r={r} />
    </ContentLoader>
);

ThreeDotsSmallLoader.defaultProps = {
    backgroundColor: 'transparent',
    cx: CX_INITIAL,
    cxSpace: CX_SPACE,
    cy: 86,
    r: 8
}
export default ThreeDotsSmallLoader;
