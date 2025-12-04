class ParticleGenerator {
    constructor(
        primitiveCallback = () => {},
        {
            pCount = 10,
            pLifespan = 1000,                 // base lifespan (ms)
            pLifespanVariance = 0.25,         // +-25% randomness
            pVelocity = [0, 1, 0],            // base velocity vector
            randomDir = 1,
            gravity = [0, -9.8, 0]            // m/s² downward
        } = {}
    ) {
        this.primitiveCallback = primitiveCallback;

        this.particleCount = pCount;
        this.pLifespan = pLifespan;
        this.pLifespanVariance = pLifespanVariance;

        this.pVelocity = pVelocity;
        this.randomDir = randomDir;
        this.gravity = gravity;

        this.particles = [];  // { obj, life, vel, rotVel }

        this.isDisabled = false;
    }

    update(deltaTime) {
        const dts = deltaTime / 1000; // convert ms to seconds

        for (let i = this.particles.length - 1; i >= 0; i--) {

            const p = this.particles[i];
            p.life -= deltaTime;

            if (p.life <= 0) {
                if (p.obj.destroy) p.obj.destroy();
                this.particles.splice(i, 1);
                continue;
            }

            // ---- Gravity (acceleration) ----
            p.vel[0] += this.gravity[0] * dts;
            p.vel[1] += this.gravity[1] * dts;
            p.vel[2] += this.gravity[2] * dts;

            // ---- Update position ----
            let pos = p.obj.getPos ? p.obj.getPos() : [0, 0, 0];

            pos[0] += p.vel[0] * dts;
            pos[1] += p.vel[1] * dts;
            pos[2] += p.vel[2] * dts;

            p.obj.setPos(pos);

            // ---- Update rotation ----
            let rot = p.obj.getRot ? p.obj.getRot() : [0, 0, 0];

            rot[0] += p.rotVel[0] * dts;
            rot[1] += p.rotVel[1] * dts;
            rot[2] += p.rotVel[2] * dts;

            p.obj.setRot(rot);
        }

        this.generateParticles(true);
    }

    generateParticles(initVAOs = false) {
        while (!this.isDisabled && this.particles.length < this.particleCount) {

            const obj = this.primitiveCallback();

            // ---- Base velocity ----
            let base = this.pVelocity ? [...this.pVelocity] : [0, 0, 0];

            // ---- Add directional randomness ----
            let rand = [
                (Math.random() - 0.5) * this.randomDir,
                (Math.random() - 0.5) * this.randomDir,
                (Math.random() - 0.5) * this.randomDir
            ];

            let vel = [
                base[0] + rand[0],
                base[1] + rand[1],
                base[2] + rand[2]
            ];

            // ---- Random rotation velocity ----
            let rotVel = [
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2
            ];

            // ---- Random lifespan ----
            let lifeFactor = 1 + (Math.random() * 2 - 1) * this.pLifespanVariance;
            let life = this.pLifespan * lifeFactor;

            this.particles.push({
                obj,
                life,
                vel,
                rotVel
            });

            if (initVAOs) initAllVAOs(obj);
        }
    }
}