'use strict';

let IconShadow = require('js/IconShadow'),
    drawUtils = require('js/drawUtils');


class Icon {

    /**
     * @param position - of this icon
     * @param iconPath - of this icon
     * @param iconBase - for this icon
     * @param iconDraggedCallback - will be called whenever this icon has been dragged
     */
    constructor(position, iconPath, iconBase, iconDraggedCallback) {
        this.originalPosition = new paper.Point(position);
        this.iconPath = iconPath;
        this.iconPath.position = position;
        this.iconPath.fillColor = null;
        this.iconBase = iconBase;
        this.iconShadow = new IconShadow(iconPath, iconBase);
        this.iconPath.remove();
        this.size = Math.max(iconPath.bounds.width, iconPath.bounds.height);
        this.scale = 1;
        this.iconPath.moveAbove(iconBase.getPathWithoutShadows());
        this.iconDraggedCallback = iconDraggedCallback;
        this.applyIcon();
    }


    /**
     * @param newSize absolute size in px which this icon should fit in (keeps aspect ratio)
     */
    setSize(newSize) {
        let scale = newSize / this.size;
        this.iconPath.scale(scale, this.iconPath.position);
        this.applyIcon();
        this.iconShadow.scale(scale);
        this.size = newSize;
    }


    /**
     * Scales this icon + shadow without changing setting this.size. setScale(1) will rescale
     * this object to its original size.
     * @param newScale factor.
     */
    setScale(newScale) {
        this.iconPath.scale(newScale / this.scale, this.iconPath.position);
        this.applyIcon();
        this.iconShadow.scale(newScale / this.scale);
        this.scale = newScale;
    }


    /**
     * Sets the color of this icon.
     * @param color paper.js compatible color value
     */
    setColor(color) {
        this.appliedIconPath.fillColor = color;
    }


    /**
     * @param {paper.Point} delta - how much this icon + shadow should be moved.
     */
    move(delta) {
        this.iconPath.position = this.iconPath.position.add(delta);
        this.applyIcon();
        this.iconShadow.move(delta);
    }


    center() {
        this.iconShadow.move(this.originalPosition.subtract(this.iconPath.position));
        this.iconPath.position = new paper.Point(this.originalPosition);
        this.applyIcon();
    }


    /**
     * Remove this icon + shadow from the canvas.
     */
    remove() {
        this.iconPath.remove();
        this.iconShadow.remove();
        if (this.appliedIconPath) this.appliedIconPath.remove();
    }


    getIconShadow() {
        return this.iconShadow;
    }


    /**
     * this.iconPath is not actually visible on the canvas, but
     * rather serves as a template for the actual icon path which is
     * cut to fit the base.
     */
    applyIcon() {
        // cut icon to base
        let basePath = this.iconBase.getPathWithoutShadows();
        let newAppliedIconPath = this.iconPath.intersect(basePath);

        let color;
        if (this.appliedIconPath) {
            color = this.appliedIconPath.fillColor;
            this.appliedIconPath.replaceWith(newAppliedIconPath);
        }
        this.appliedIconPath = newAppliedIconPath;

        // setup drag to move
        this.appliedIconPath.onMouseDrag = function(event) {
            this.move(event.delta);
            this.iconDraggedCallback();
        }.bind(this);

        // reapply color (if any)
        if (color) {
            this.setColor(color);
        }
    }

}

module.exports = Icon;
