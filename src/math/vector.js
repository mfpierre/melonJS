/*
 * MelonJS Game Engine
 * Copyright (C) 2011 - 2013, Olivier BIOT
 * http://www.melonjs.org
 *
 */
(function () {
    /**
     * a generic 2D Vector Object
     * @class
     * @extends Object
     * @memberOf me
     * @constructor
     * @param {Number} [x=0] x value of the vector
     * @param {Number} [y=0] y value of the vector
     */
    me.Vector2d = Object.extend(
    /** @scope me.Vector2d.prototype */
    {
        /** @ignore */
        init : function (x, y) {
            return this.set(x || 0, y || 0);
        },

        /**
         * set the Vector x and y properties to the given values<br>
         * @name set
         * @memberOf me.Vector2d
         * @function
         * @param {Number} x
         * @param {Number} y
         * @return {me.Vector2d} Reference to this object for method chaining
         */
        set : function (x, y) {
            if (x !== +x || y !== +y) {
                throw new me.Vector2d.Error(
                    "invalid x,y parameters (not a number)"
                );
            }

            /**
             * x value of the vector
             * @public
             * @type Number
             * @name x
             * @memberOf me.Vector2d
             */
            this.x = x;

            /**
             * y value of the vector
             * @public
             * @type Number
             * @name y
             * @memberOf me.Vector2d
             */
            this.y = y;

            return this;
        },

        /**
         * set the Vector x and y properties to 0
         * @name setZero
         * @memberOf me.Vector2d
         * @function
         * @return {me.Vector2d} Reference to this object for method chaining
         */
        setZero : function () {
            return this.set(0, 0);
        },

        /**
         * set the Vector x and y properties using the passed vector
         * @name setV
         * @memberOf me.Vector2d
         * @function
         * @param {me.Vector2d} v
         * @return {me.Vector2d} Reference to this object for method chaining
         */
        setV : function (v) {
            this.x = v.x;
            this.y = v.y;
            return this;
        },

        /**
         * Add the passed vector to this vector
         * @name add
         * @memberOf me.Vector2d
         * @function
         * @param {me.Vector2d} v
         * @return {me.Vector2d} Reference to this object for method chaining
         */
        add : function (v) {
            this.x += v.x;
            this.y += v.y;
            return this;
        },

        /**
         * Substract the passed vector to this vector
         * @name sub
         * @memberOf me.Vector2d
         * @function
         * @param {me.Vector2d} v
         * @return {me.Vector2d} Reference to this object for method chaining
         */
        sub : function (v) {
            this.x -= v.x;
            this.y -= v.y;
            return this;
        },

        /**
         * Multiply this vector values by the given scalar
         * @name scale
         * @memberOf me.Vector2d
         * @function
         * @param {Number} x
         * @param {Number} [y=x]
         * @return {me.Vector2d} Reference to this object for method chaining
         */
        scale : function (x, y) {
            this.x *= x;
            this.y *= typeof (y) !== "undefined" ? y : x;
            return this;
        },

        /**
         * Multiply this vector values by the passed vector
         * @name scaleV
         * @memberOf me.Vector2d
         * @function
         * @param {me.Vector2d} v
         * @return {me.Vector2d} Reference to this object for method chaining
         */
        scaleV : function (v) {
            this.x *= v.x;
            this.y *= v.y;
            return this;
        },

        /**
         * Divide this vector values by the passed value
         * @name div
         * @memberOf me.Vector2d
         * @function
         * @param {Number} value
         * @return {me.Vector2d} Reference to this object for method chaining
         */
        div : function (n) {
            this.x /= n;
            this.y /= n;
            return this;
        },

        /**
         * Update this vector values to absolute values
         * @name abs
         * @memberOf me.Vector2d
         * @function
         * @return {me.Vector2d} Reference to this object for method chaining
         */
        abs : function () {
            if (this.x < 0) {
                this.x = -this.x;
            }
            if (this.y < 0) {
                this.y = -this.y;
            }
            return this;
        },

        /**
         * Clamp the vector value within the specified value range
         * @name clamp
         * @memberOf me.Vector2d
         * @function
         * @param {Number} low
         * @param {Number} high
         * @return {me.Vector2d} new me.Vector2d
         */
        clamp : function (low, high) {
            return new me.Vector2d(this.x.clamp(low, high), this.y.clamp(low, high));
        },

        /**
         * Clamp this vector value within the specified value range
         * @name clampSelf
         * @memberOf me.Vector2d
         * @function
         * @param {Number} low
         * @param {Number} high
         * @return {me.Vector2d} Reference to this object for method chaining
         */
        clampSelf : function (low, high) {
            this.x = this.x.clamp(low, high);
            this.y = this.y.clamp(low, high);
            return this;
        },

        /**
         * Update this vector with the minimum value between this and the passed vector
         * @name minV
         * @memberOf me.Vector2d
         * @function
         * @param {me.Vector2d} v
         * @return {me.Vector2d} Reference to this object for method chaining
         */
        minV : function (v) {
            this.x = this.x < v.x ? this.x : v.x;
            this.y = this.y < v.y ? this.y : v.y;
            return this;
        },

        /**
         * Update this vector with the maximum value between this and the passed vector
         * @name maxV
         * @memberOf me.Vector2d
         * @function
         * @param {me.Vector2d} v
         * @return {me.Vector2d} Reference to this object for method chaining
         */
        maxV : function (v) {
            this.x = this.x > v.x ? this.x : v.x;
            this.y = this.y > v.y ? this.y : v.y;
            return this;
        },

        /**
         * Floor the vector values
         * @name floor
         * @memberOf me.Vector2d
         * @function
         * @return {me.Vector2d} new me.Vector2d
         */
        floor : function () {
            return new me.Vector2d(~~this.x, ~~this.y);
        },

        /**
         * Floor this vector values
         * @name floorSelf
         * @memberOf me.Vector2d
         * @function
         * @return {me.Vector2d} Reference to this object for method chaining
         */
        floorSelf : function () {
            this.x = ~~this.x;
            this.y = ~~this.y;
            return this;
        },

        /**
         * Ceil the vector values
         * @name ceil
         * @memberOf me.Vector2d
         * @function
         * @return {me.Vector2d} new me.Vector2d
         */
        ceil : function () {
            return new me.Vector2d(Math.ceil(this.x), Math.ceil(this.y));
        },

        /**
         * Ceil this vector values
         * @name ceilSelf
         * @memberOf me.Vector2d
         * @function
         * @return {me.Vector2d} Reference to this object for method chaining
         */
        ceilSelf : function () {
            this.x = Math.ceil(this.x);
            this.y = Math.ceil(this.y);
            return this;
        },

        /**
         * Negate the vector values
         * @name negate
         * @memberOf me.Vector2d
         * @function
         * @return {me.Vector2d} new me.Vector2d
         */
        negate : function () {
            return new me.Vector2d(-this.x, -this.y);
        },

        /**
         * Negate this vector values
         * @name negateSelf
         * @memberOf me.Vector2d
         * @function
         * @return {me.Vector2d} Reference to this object for method chaining
         */
        negateSelf : function () {
            this.x = -this.x;
            this.y = -this.y;
            return this;
        },

        /**
         * Copy the x,y values of the passed vector to this one
         * @name copy
         * @memberOf me.Vector2d
         * @function
         * @param {me.Vector2d} v
         * @return {me.Vector2d} Reference to this object for method chaining
         */
        copy : function (v) {
            this.x = v.x;
            this.y = v.y;
            return this;
        },

        /**
         * return true if the two vectors are the same
         * @name equals
         * @memberOf me.Vector2d
         * @function
         * @param {me.Vector2d} v
         * @return {Boolean}
         */
        equals : function (v) {
            return ((this.x === v.x) && (this.y === v.y));
        },

        /**
         * normalize this vector (scale the vector so that its magnitude is 1)
         * @name normalize
         * @memberOf me.Vector2d
         * @function
         * @return {me.Vector2d} Reference to this object for method chaining
         */
        normalize : function () {
            var d = this.length();
            if (d > 0) {
                this.x = this.x / d;
                this.y = this.y / d;
            }
            return this;
        },
        
        /**
         * change this vector to be perpendicular to what it was before.<br>
         * (Effectively rotates it 90 degrees in a clockwise direction)
         * @name perp
         * @memberOf me.Vector2d
         * @function
         * @return {me.Vector2d} Reference to this object for method chaining
         */
        perp : function () {
            var x = this.x;
            this.x = this.y;
            this.y = -x;
            return this;
        },

        /**
         * Rotate this vector (counter-clockwise) by the specified angle (in radians).
         * @name rotate
         * @memberOf me.Vector2d
         * @function
         * @param {number} angle The angle to rotate (in radians)
         * @return {me.Vector2d} Reference to this object for method chaining
         */
        rotate : function (angle) {
            var x = this.x;
            var y = this.y;
            this.x = x * Math.cos(angle) - y * Math.sin(angle);
            this.y = x * Math.sin(angle) + y * Math.cos(angle);
            return this;
        },
        
         /**
         * Reverse this vector.
         * @name reverse
         * @memberOf me.Vector2d
         * @function
         * @return {me.Vector2d} Reference to this object for method chaining
         */
        reverse : function () {
            this.x = -this.x;
            this.y = -this.y;
            return this;
        },
        
        /**
         * return the dot product of this vector and the passed one
         * @name dotProduct
         * @memberOf me.Vector2d
         * @function
         * @param {me.Vector2d} v
         * @return {Number} The dot product.
         */
        dotProduct : function (v) {
            return this.x * v.x + this.y * v.y;
        },

       /**
         * return the square length of this vector
         * @name length2
         * @memberOf me.Vector2d
         * @function
         * @return {Number} The length^2 of this vector.
         */
        length2 : function () {
            return this.dotProduct(this);
        },
        
        /**
         * return the length (magnitude) of this vector
         * @name length
         * @memberOf me.Vector2d
         * @function
         * @return {Number} the length of this vector
         */
        length : function () {
            return Math.sqrt(this.length2());
        },

        /**
         * return the distance between this vector and the passed one
         * @name distance
         * @memberOf me.Vector2d
         * @function
         * @param {me.Vector2d} v
         * @return {Number}
         */
        distance : function (v) {
            return Math.sqrt((this.x - v.x) * (this.x - v.x) + (this.y - v.y) * (this.y - v.y));
        },

        /**
         * return the angle between this vector and the passed one
         * @name angle
         * @memberOf me.Vector2d
         * @function
         * @param {me.Vector2d} v
         * @return {Number} angle in radians
         */
        angle : function (v) {
            return Math.atan2((v.y - this.y), (v.x - this.x));
        },
            
        /**
         * project this vector on to another vector.
         * @name project
         * @memberOf me.Vector2d
         * @function
         * @param {me.Vector2d} v The vector to project onto.
         * @return {me.Vector2d} Reference to this object for method chaining
         */
        project : function (v) {
            var amt = this.dotProduct(v) / v.length2();
            this.x = amt * v.x;
            this.y = amt * v.y;
            return this;
        },

        /**
         * Project this vector onto a vector of unit length.<br>
         * This is slightly more efficient than `project` when dealing with unit vectors.
         * @name projectN
         * @memberOf me.Vector2d
         * @function
         * @param {me.Vector2d} v The unit vector to project onto.
         * @return {me.Vector2d} Reference to this object for method chaining
         */
        projectN : function (v) {
            var amt = this.dotProduct(v);
            this.x = amt * v.x;
            this.y = amt * v.y;
            return this;
        },
        
        /**
         * Reflect this vector on an arbitrary axis.
         * @name reflect          
         * @memberOf me.Vector2d
         * @function
         * @param {me.Vector2d} axis The vector representing the axis.
         * @return {me.Vector2d} Reference to this object for method chaining.
         */
        reflect : function (axis) {
            var x = this.x;
            var y = this.y;
            this.project(axis).scale(2);
            this.x -= x;
            this.y -= y;
            return this;
        },
 
        /**
         * Reflect this vector on an arbitrary axis (represented by a unit vector) <br>
         * This is slightly more efficient than `reflect` when dealing with unit vectors.
         * @name reflectN
         * @memberOf me.Vector2d
         * @function
         * @param {me.Vector2d} axis The vector representing the axis.
         * @return {me.Vector2d} Reference to this object for method chaining.
         */
        reflectN : function (axis) {
            var x = this.x;
            var y = this.y;
            this.projectN(axis).scale(2);
            this.x -= x;
            this.y -= y;
            return this;
        },
        
        /**
         * return a clone copy of this vector
         * @name clone
         * @memberOf me.Vector2d
         * @function
         * @return {me.Vector2d} new me.Vector2d
         */
        clone : function () {
            return new me.Vector2d(this.x, this.y);
        },

        /**
         * convert the object to a string representation
         * @name toString
         * @memberOf me.Vector2d
         * @function
         * @return {String}
         */
        toString : function () {
            return "x:" + this.x + ",y:" + this.y;
        }
    });

    /**
     * Base class for Vector2d exception handling.
     * @name Vector2d.Error
     * @ignore
     * @class
     * @memberOf me
     * @constructor
     * @param {String} msg Error message.
     */
    me.Vector2d.Error = me.Error.extend({
        init : function (msg) {
            this._super(me.Error, "init", [ msg ]);
            this.name = "me.Vector2d.Error";
        }
    });
})();
