import { Canvas } from "@react-three/fiber";
import { ContactShadows, Sparkles } from "@react-three/drei";
import Sword from "./Sword";

export default function Scene({ torchRef, pointerRef }) {
  return (
    <Canvas
      className="sword-canvas"
      style={{ position: "fixed", inset: 0, pointerEvents: "none" }}
      gl={{ alpha: true, antialias: true }}
      camera={{ position: [0, 0, 8], fov: 32 }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
    >
      {/* Pencahayaan ambient hangat selaras dengan latar perkamen emas */}
      <ambientLight intensity={0.65} color={"#fef3c7"} />
      <directionalLight position={[4, 5, 4]} intensity={1.0} color={"#fde68a"} />
      <directionalLight position={[-4, -2, 2]} intensity={0.35} color={"#708d96"} />

      <Sword torchRef={torchRef} pointerRef={pointerRef} />

      {/* Partikel debu emas mengambang halus */}
      <Sparkles count={24} scale={[6, 4, 3]} size={2.2} speed={0.2} color={"#d97706"} opacity={0.4} />

      <ContactShadows
        position={[0, -1.6, 0]}
        opacity={0.2}
        scale={8}
        blur={3.2}
        far={2.6}
        color="#1e293b"
      />
    </Canvas>
  );
}