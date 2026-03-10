import "./style.css";
import { mount } from "@deijose/nix-js";
import { setupRouter } from "./core/router/router";
import { App } from "./app";

setupRouter();
mount(new App(), "#app");

