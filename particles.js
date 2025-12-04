class ParticleGenerator {
        constructor(
        primitiveCallback = () => {},
        {
            pCount = 10,
            pLifespan = 1,
            pVelocity = 10,
            randomDir = 1
        } = {}
    ) {
        this.primitiveCallback = primitiveCallback;

        this.particleCount = pCount;
        this.pLifespan = pLifespan;
        this.pVelocity = pVelocity;
        this.randomDir = randomDir;

        // store particles in an array, each entry = { obj, life, vel, rotVel }
        this.particles = [];

        this.generateParticles();
    }

    update(deltaTime) {
        for (let i = this.particles.length - 1; i >= 0; i--) {

            let p = this.particles[i];
            p.life -= deltaTime;

            if (p.life <= 0) {
                // Remove old primitive
                if (p.obj.destroy) p.obj.destroy();

                this.particles.splice(i, 1);
                continue;
            }

            // ---- Update position ----
            let pos = p.obj.getPos ? p.obj.getPos() : [0,0,0];

            pos[0] += p.vel[0] * deltaTime;
            pos[1] += p.vel[1] * deltaTime;
            pos[2] += p.vel[2] * deltaTime;

            p.obj.setPos(pos);

            // ---- Update rotation ----
            let rot = p.obj.getRot ? p.obj.getRot() : [0,0,0];

            rot[0] += p.rotVel[0] * deltaTime;
            rot[1] += p.rotVel[1] * deltaTime;
            rot[2] += p.rotVel[2] * deltaTime;

            p.obj.setRot(rot);
        }

        // Refill to required count
        this.generateParticles();
    }

     generateParticles() {
        while (this.particles.length < this.particleCount) {

            let obj = this.primitiveCallback();  
            // You position it before returning obj if needed

            // Create a random direction vector
            let dir = [
                (Math.random() - 0.5) * this.randomDir,
                Math.random() * this.randomDir,   // bias upward slightly
                (Math.random() - 0.5) * this.randomDir
            ];

            // Normalize
            let len = Math.hypot(dir[0], dir[1], dir[2]) || 1;
            dir = [dir[0] / len, dir[1] / len, dir[2] / len];

            // Scale by speed
            let vel = dir.map(v => v * this.pVelocity);

            // Random rotation velocity (radians/sec)
            let rotVel = [
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2
            ];

            this.particles.push({
                obj,
                life: this.pLifespan,
                vel,
                rotVel
            });
        }
    }


}