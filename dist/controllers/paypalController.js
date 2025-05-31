"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.captureOrder = exports.createOrder = void 0;
const paypal_1 = __importDefault(require("../config/paypal"));
const paypal = __importStar(require("@paypal/checkout-server-sdk"));
const createOrderSchema_1 = require("../schemas/createOrderSchema");
const createOrder = async (req, res) => {
    var _a, _b;
    const parseResult = createOrderSchema_1.createOrderSchema.safeParse(req.body);
    if (!parseResult.success) {
        return res.status(400).json({
            error: 'Dados inválidos',
            issues: parseResult.error.errors,
        });
    }
    const { value, currency_code, description, invoice_id, items } = parseResult.data;
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [
            {
                amount: {
                    currency_code,
                    value: value.toString(),
                    breakdown: {
                        item_total: {
                            currency_code,
                            value: value.toString(),
                        },
                        discount: {
                            currency_code,
                            value: '0.00',
                        },
                        handling: {
                            currency_code,
                            value: '0.00',
                        },
                        insurance: {
                            currency_code,
                            value: '0.00',
                        },
                        shipping: {
                            currency_code,
                            value: '0.00',
                        },
                        shipping_discount: {
                            currency_code,
                            value: '0.00',
                        },
                        tax_total: {
                            currency_code,
                            value: '0.00',
                        },
                    },
                },
                description,
                invoice_id,
                custom_id: `ref-${Date.now()}`,
                items: items.map((item) => ({
                    name: item.name,
                    description: item.description || '',
                    quantity: item.quantity.toString(),
                    unit_amount: {
                        currency_code,
                        value: item.unit_price.toString(),
                    },
                    category: item.category,
                })),
            },
        ],
    });
    try {
        const order = await paypal_1.default.execute(request);
        const approveLink = (_b = (_a = order.result.links) === null || _a === void 0 ? void 0 : _a.find((link) => link.rel === 'approve')) === null || _b === void 0 ? void 0 : _b.href;
        return res.status(201).json({
            id: order.result.id,
            status: order.result.status,
            approveUrl: approveLink,
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erro ao criar o pedido' });
    }
};
exports.createOrder = createOrder;
const captureOrder = async (req, res) => {
    const { orderID } = req.params;
    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    try {
        const capture = await paypal_1.default.execute(request);
        return res.status(200).json({ message: 'Pagamento capturado com sucesso', capture: capture.result });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erro ao capturar o pagamento', details: err instanceof Error ? err.message : 'Erro desconhecido' });
    }
};
exports.captureOrder = captureOrder;
