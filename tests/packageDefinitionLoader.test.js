const path = require("path");
const grpc = require("grpc");
const { GrpcHostBuilder } = require("grpc-host-builder");

const { load, loadSync } = require("../src/index").packageDefinition;

const {
  HelloRequest: ServerUnaryRequest,
  HelloResponse: ServerUnaryResponse
} = require("./generated/server/greeter_pb").v1;
const { HelloRequest: ClientUnaryRequest, Event, GreeterClient } = require("./generated/client/greeter_client_pb").v1;
const { Timestamp } = require("./generated/client/greeter_client_pb").google.protobuf;

grpc.setLogVerbosity(grpc.logVerbosity.ERROR + 1);
const grpcBind = "0.0.0.0:3000";
let server = null;
let client = null;

const createHost = packageDefinition =>
  new GrpcHostBuilder()
    .addService(grpc.loadPackageDefinition(packageDefinition).v1.Greeter.service, {
      sayHello: call => {
        const request = new ServerUnaryRequest(call.request);

        const event = request.event;
        event.id = 1;
        return new ServerUnaryResponse({ event });
      }
    })
    .bind(grpcBind)
    .build();

const getEvent = async () => {
  const moment = new Timestamp();
  moment.setSeconds(123456);

  const event = new Event();
  event.setName("Tom");
  event.setMoment(moment);

  const request = new ClientUnaryRequest();
  request.setEvent(event);

  client = new GreeterClient(grpcBind, grpc.credentials.createInsecure());
  return (await client.sayHello(request)).getEvent();
};

afterEach(() => {
  if (client) client.close();
  if (server) server.forceShutdown();
});

test("Must load package definition synchronously", async () => {
  // Given
  server = createHost(
    loadSync(path.join(__dirname, "./protos/greeter.proto"), {
      includeDirs: [path.join(__dirname, "./protos")]
    })
  );

  // When
  const actualEvent = await getEvent();

  // Then
  expect(actualEvent.getId()).toBe(1);
  expect(actualEvent.getName()).toBe("Tom");
  expect(actualEvent.getMoment().getSeconds()).toBe(123456);
});

test("Must load package definition asynchronously", async () => {
  // Given
  server = createHost(
    await load(path.join(__dirname, "./protos/greeter.proto"), {
      includeDirs: [path.join(__dirname, "./protos")]
    })
  );

  // When
  const actualEvent = await getEvent();

  // Then
  expect(actualEvent.getId()).toBe(1);
  expect(actualEvent.getName()).toBe("Tom");
  expect(actualEvent.getMoment().getSeconds()).toBe(123456);
});
