interface LettersAvatarProps {
  initials: string
}

export const LettersAvatar = ({ initials }: LettersAvatarProps) => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'>
      <g data-name='Avatar/40px/Letters' transform='translate(-1714 -16)'>
        <circle cx='20' cy='20' r='20' transform='translate(1714 16)' fill='#bcbccb' />
        <text transform='translate(1734 40)' fill='#fff' ><tspan x='-8.354' y='0'>{initials}</tspan></text>
        <rect width='14' height='14' transform='translate(1740 42)' fill='none' />
        <g data-name='Status indicator' transform='translate(1740 42)' fill='#5ee2a0' stroke='#fff' strokeWidth='2'>
          <circle cx='7' cy='7' r='7' stroke='none' />
          <circle cx='7' cy='7' r='6' fill='none' />
        </g>
      </g>
    </svg>
  );
}
