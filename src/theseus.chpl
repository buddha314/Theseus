use moschitto,
    Chingon,
    Relch,
    Time;

config const MAZE_WIDTH: int,
             MAZE_HEIGHT: int,
             STARTING_POSITION: int,
             EXIT_POSITION: int,
             EXIT_REWARD: real,
             STEP_PENALTY: real,
             N_STEPS: int,
             N_EPOCHS: int,
             EPOCH_EMIT_INTERVAL: int,
             EPOCH_SLEEP_INTERVAL: real,
             LEARNING_EPSILON: real;


proc buildWorld() {
    var maze = new Maze(width=MAZE_WIDTH, height=MAZE_HEIGHT, wrap=false);
    return maze;
}

proc buildEnv(maze: Maze) {
  var env = new Environment(name="simulating amazing!"),
      theseus = maze.addAgent(name="Theseus", position=new MazePosition(STARTING_POSITION)),
      csense = maze.getDefaultCellSensor(),
      exitReward = new Reward(value=EXIT_REWARD, penalty=STEP_PENALTY),
      exitState:[1..1, 1..MAZE_WIDTH*MAZE_HEIGHT] int=0;

  exitState[1, EXIT_POSITION] = 1;
  exitReward = exitReward.buildTargets(targets=exitState);

  env.addWorld(maze);
  theseus = maze.addAgentSensor(agent=theseus, target=new SecretAgent()
    , sensor=csense, reward=exitReward);

  exitReward.finalize();
  theseus = maze.addAgentServo(agent=theseus, servo=maze.getDefaultMotionServo()
    ,sensor=csense);
  theseus = maze.setAgentPolicy(agent=theseus, policy=new DQPolicy(epsilon=LEARNING_EPSILON, avoid=false)): MazeAgent;
  return env;
}


record EpochSetupDTO {
  var epochs: int,
      maxsteps: int;
}

class IndexController:MoschittoController {
  var pusher: MoschittoPublisher,
      maze: Maze,
      env: Environment;
  proc init() {
    this.pusher = new MoschittoPublisher();
    this.pusher.Connect();
    this.maze = buildWorld();
    this.env = buildEnv(this.maze);
  }

  proc this(topic:string, data:string, msg:mosquitto_message){
    if data == "feedme" {
      this.pusher.PublishObj("/epoch/setup", new EpochSetupDTO(epochs=N_EPOCHS, maxsteps=N_STEPS));
      this.pusher.PublishObj("/data/graph", maze.DTO());
      runWithSloMo(env=env, epochs=N_EPOCHS, steps=N_STEPS
        ,epochEmitInterval=EPOCH_EMIT_INTERVAL, epochSleepInterval=EPOCH_SLEEP_INTERVAL
        ,channel=this.pusher);
    }
  }

}

proc runWithSloMo(env:Environment, epochs: int, steps:int
  , epochEmitInterval: int, epochSleepInterval: real
  , channel: MoschittoPublisher) {

  var emit: bool = false;
  for a in env.run(epochs=epochs, steps=steps) {
    if a: EpochDTO != nil {
        if a.id % EPOCH_EMIT_INTERVAL == 0 {
          channel.PublishObj("/epoch/update", a);
          emit = true;
        } else {
          emit = false;
        }
        writeln(a);
    }
    if emit && a: AgentDTO != nil {
      channel.PublishObj("/data/highlight-node", a);
      sleep(EPOCH_SLEEP_INTERVAL);
      writeln(a);
    }

  }

}


proc main() {
  var subscriber = new MoschittoSubscriber(),
      idx = new IndexController();

   subscriber.Connect();
   sleep(1);
   subscriber.Subscribe(topic="data/setup", controller=idx);
   subscriber.Listen();


}
