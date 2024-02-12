import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import * as Utils from 'resource:///com/github/Aylur/ags/utils.js';
import Variable from 'resource:///com/github/Aylur/ags/variable.js';

const arrow_icons = {
    right: 'pan-end-symbolic',
    left: 'pan-start-symbolic',
    up: 'pan-up-symbolic',
    down: 'pan-down-symbolic',
};

/**
 * @param {import('types/widgets/revealer').default} revealer
 * @param {'left' | 'right' | 'up' | 'down'} direction
 */
const Arrow = (revealer, direction) => {
    let deg = 0;

    const icon = Widget.Icon({
        icon: arrow_icons[direction],
    });

    const animate = () => {
        const t = 200 / 20;
        const step = revealer.reveal_child ? 10 : -10;
        for (let i = 0; i < 18; ++i) {
            Utils.timeout(t * i, () => {
                deg += step;
                icon.setCss(`-gtk-icon-transform: rotate(${deg}deg);`);
            });
        }
    };

    return Widget.Button({
        class_name: 'panel-button sub-menu',
        on_clicked: () => {
            animate();
            revealer.reveal_child = !revealer.reveal_child;
        },
        child: icon,
    });
};

/**
 * @param {Object} o
 * @param {import('types/widgets/box').default['children']} o.children
 * @param {'left' | 'right' | 'up' | 'down'=} o.direction
 */
export default ({ children, direction = 'left' }) => {
    const posStart = direction === 'up' || direction === 'left';
    const posEnd = direction === 'down' || direction === 'right';
    const revealer = Widget.Revealer({
        revealChild: true,
        transition: `slide_${direction}`,
        child: Widget.Box({
            children,
        }),
    });

    return Widget.Box({
        vertical: direction === 'up' || direction === 'down',
        children: [
            posStart && revealer,
            Arrow(revealer, direction),
            posEnd && revealer,
        ],
    });
};
